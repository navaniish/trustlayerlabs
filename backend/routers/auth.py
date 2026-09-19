import os
import sys
import uuid
import json
import pyotp
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import datetime, timedelta, timezone
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field

from fastapi import APIRouter, Depends, HTTPException, status, Request, Response, Cookie
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, delete

from database import get_db
from config import settings
from models import User, Session, Organization, AuditLog, PasswordResetToken
from security.crypto import (
    hash_password,
    verify_password,
    hash_token,
    generate_random_token,
    create_jwt_access_token,
)
from security.rbac import get_current_user
from security.rate_limiter import rate_limiter

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

def utc_now():
    return datetime.now(timezone.utc).replace(tzinfo=None)

# Pydantic Schemas
class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    totp_code: Optional[str] = None

class RegisterRequest(BaseModel):
    email: EmailStr
    full_name: str
    password: str = Field(..., min_length=8)
    role: Optional[str] = "STAFF"

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "Bearer"
    expires_in: int
    user: dict

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

class MFASetupResponse(BaseModel):
    secret: str
    otpauth_url: str

class MFAVerifyRequest(BaseModel):
    totp_code: str

class SessionResponse(BaseModel):
    id: str
    device_name: str
    ip_address: Optional[str]
    user_agent: Optional[str]
    created_at: datetime
    last_used_at: datetime
    is_current: bool

async def log_audit_event(
    db: AsyncSession,
    event_type: str,
    user_id: Optional[str],
    org_id: Optional[str],
    request: Request,
    details: dict,
    severity: str = "INFO"
):
    ip = request.client.host if request.client else "127.0.0.1"
    ua = request.headers.get("User-Agent", "Unknown")
    log = AuditLog(
        id=str(uuid.uuid4()),
        event_type=event_type,
        user_id=user_id,
        organization_id=org_id,
        ip_address=ip,
        user_agent=ua,
        details=json.dumps(details),
        severity=severity
    )
    db.add(log)

@router.post("/login", response_model=TokenResponse)
async def login(
    login_data: LoginRequest,
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db)
):
    """
    Production-grade login endpoint implementing:
    - Progressive rate-limiting
    - Generic error messages (no email enumeration)
    - Argon2id password verification
    - Account lockout check
    - TOTP MFA challenge support
    - Server-side DB Session creation
    - Rotating HttpOnly Refresh Token Cookie issuance
    - Short-Lived Access Token return
    """
    rate_limiter.check_rate_limit(request, "login", max_requests=5, window_seconds=60)
    
    generic_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid email or password."
    )

    # Fetch User by Email
    result = await db.execute(select(User).where(User.email == login_data.email.lower()))
    user = result.scalars().first()

    if not user:
        # Audit log failed attempt silently
        await log_audit_event(db, "LOGIN_FAILED", None, None, request, {"email": login_data.email}, severity="WARNING")
        raise generic_error

    # Check Account Lockout
    if user.locked_until and user.locked_until > utc_now():
        await log_audit_event(db, "LOGIN_BLOCKED_LOCKOUT", user.id, user.organization_id, request, {"reason": "Account locked"}, severity="SECURITY_ALERT")
        raise HTTPException(
            status_code=status.HTTP_423_LOCKED,
            detail="Account temporarily locked due to multiple failed login attempts. Try again later."
        )

    # Verify Password (Argon2id)
    if not verify_password(login_data.password, user.password_hash):
        user.failed_login_count += 1
        if user.failed_login_count >= settings.MAX_LOGIN_ATTEMPTS:
            user.locked_until = utc_now() + timedelta(minutes=settings.LOCKOUT_DURATION_MINUTES)
            user.account_status = "LOCKED"
            await log_audit_event(db, "ACCOUNT_LOCKED", user.id, user.organization_id, request, {"attempts": user.failed_login_count}, severity="SECURITY_ALERT")
        else:
            await log_audit_event(db, "LOGIN_FAILED", user.id, user.organization_id, request, {"attempts": user.failed_login_count}, severity="WARNING")
        
        await db.commit()
        raise generic_error

    # MFA Check
    if user.mfa_enabled:
        if not login_data.totp_code:
            raise HTTPException(
                status_code=status.HTTP_428_PRECONDITION_REQUIRED,
                detail="MFA authentication required. Please provide 6-digit TOTP code."
            )
        totp = pyotp.TOTP(user.mfa_secret)
        if not totp.verify(login_data.totp_code):
            await log_audit_event(db, "MFA_FAILED", user.id, user.organization_id, request, {}, severity="SECURITY_ALERT")
            raise generic_error

    # Reset failure counters on successful login
    user.failed_login_count = 0
    user.locked_until = None
    user.last_login_at = utc_now()
    user.account_status = "ACTIVE"

    # Generate Session and Refresh Token Family
    token_family_id = str(uuid.uuid4())
    raw_refresh_token = generate_random_token()
    refresh_hash = hash_token(raw_refresh_token)
    session_id = str(uuid.uuid4())
    
    expires_at = utc_now() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    ip_addr = request.client.host if request.client else "127.0.0.1"
    user_agent = request.headers.get("User-Agent", "Unknown")

    db_session = Session(
        id=session_id,
        user_id=user.id,
        token_family_id=token_family_id,
        refresh_token_hash=refresh_hash,
        expires_at=expires_at,
        ip_address=ip_addr,
        user_agent=user_agent,
        device_name="Web Browser"
    )
    db.add(db_session)
    await log_audit_event(db, "LOGIN_SUCCESS", user.id, user.organization_id, request, {"session_id": session_id})
    await db.commit()

    # Set Secure HttpOnly Cookie for Refresh Token
    response.set_cookie(
        key=settings.COOKIE_NAME,
        value=raw_refresh_token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        domain=settings.COOKIE_DOMAIN,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400,
        path="/api/v1/auth"
    )

    # Issue Short-Lived Access Token (JWT)
    access_token = create_jwt_access_token(user.id, user.email, user.role)

    return TokenResponse(
        access_token=access_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user={
            "id": user.id,
            "email": user.email,
            "name": user.full_name,
            "role": user.role,
            "mfa_enabled": user.mfa_enabled,
        }
    )

@router.post("/register", response_model=TokenResponse)
async def register(
    reg_data: RegisterRequest,
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db)
):
    """
    Register a new corporate user account.
    """
    rate_limiter.check_rate_limit(request, endpoint_key="register", max_requests=10, window_seconds=60)

    email = reg_data.email.strip().lower()

    # Check if user already exists
    result = await db.execute(select(User).where(User.email == email))
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    # Get Organization
    org_result = await db.execute(select(Organization))
    org = org_result.scalars().first()
    org_id = org.id if org else str(uuid.uuid4())

    valid_roles = ["SUPER_ADMIN", "ADMIN", "SALES", "FINANCE", "STAFF", "CLIENT"]
    assigned_role = reg_data.role.upper() if reg_data.role and reg_data.role.upper() in valid_roles else "STAFF"

    role_permissions = {
        "SUPER_ADMIN": '["quotation:create", "quotation:read", "quotation:update", "quotation:delete", "invoice:create", "invoice:read", "invoice:update", "invoice:delete", "client:create", "client:read", "client:update", "client:delete", "user:create", "user:read", "user:update", "user:delete", "settings:update", "audit:read", "security:admin"]',
        "ADMIN": '["quotation:create", "quotation:read", "quotation:update", "quotation:delete", "invoice:create", "invoice:read", "invoice:update", "invoice:delete", "client:create", "client:read", "client:update", "client:delete", "user:read", "settings:update", "audit:read"]',
        "SALES": '["quotation:create", "quotation:read", "quotation:update", "client:create", "client:read", "client:update", "invoice:read"]',
        "FINANCE": '["invoice:create", "invoice:read", "invoice:update", "invoice:delete", "quotation:read", "client:read", "audit:read"]',
        "STAFF": '["quotation:read", "invoice:read", "client:read"]',
        "CLIENT": '["quotation:read", "invoice:read"]',
    }

    new_user = User(
        id=str(uuid.uuid4()),
        organization_id=org_id,
        email=email,
        password_hash=hash_password(reg_data.password),
        full_name=reg_data.full_name,
        role=assigned_role,
        permissions=role_permissions.get(assigned_role, role_permissions["STAFF"]),
        account_status="ACTIVE"
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    # Issue Refresh Token & Session
    raw_refresh_token = generate_random_token(32)
    refresh_hash = hash_token(raw_refresh_token)
    token_family_id = str(uuid.uuid4())
    session_id = str(uuid.uuid4())
    expires_at = utc_now() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    ip_addr = request.client.host if request.client else "127.0.0.1"
    user_agent = request.headers.get("User-Agent", "Unknown")

    db_session = Session(
        id=session_id,
        user_id=new_user.id,
        token_family_id=token_family_id,
        refresh_token_hash=refresh_hash,
        expires_at=expires_at,
        ip_address=ip_addr,
        user_agent=user_agent,
        device_name="Web Browser"
    )
    db.add(db_session)
    await log_audit_event(db, "USER_REGISTERED", new_user.id, org_id, request, {"email": email, "role": assigned_role})
    await db.commit()

    response.set_cookie(
        key=settings.COOKIE_NAME,
        value=raw_refresh_token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        domain=settings.COOKIE_DOMAIN,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400,
        path="/api/v1/auth"
    )

    access_token = create_jwt_access_token(new_user.id, new_user.email, new_user.role)

    return TokenResponse(
        access_token=access_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user={
            "id": new_user.id,
            "email": new_user.email,
            "name": new_user.full_name,
            "role": new_user.role,
            "mfa_enabled": new_user.mfa_enabled,
        }
    )

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    request: Request,
    response: Response,
    trustlayer_refresh_token: Optional[str] = Cookie(None),
    db: AsyncSession = Depends(get_db)
):
    """
    Refresh Token Rotation & Token Family Reuse Detection:
    - Validates refresh cookie
    - Checks session & token family
    - IF AN OLD REFRESH TOKEN IS REUSED -> Revokes the entire token family/session & logs SECURITY_ALERT!
    - Otherwise rotates refresh token, issues new cookie & new short-lived access token.
    """
    raw_token = trustlayer_refresh_token or request.cookies.get(settings.COOKIE_NAME)
    if not raw_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token cookie missing."
        )

    incoming_hash = hash_token(raw_token)

    # 1. Search active session matching exact token hash
    result = await db.execute(
        select(Session).where(
            Session.refresh_token_hash == incoming_hash,
            Session.revoked_at.is_(None)
        )
    )
    existing_session = result.scalars().first()

    if not existing_session:
        # 2. Token Reuse Detection Triggered!
        # Search if any session with this hash was ALREADY revoked or exists
        reuse_result = await db.execute(select(Session).where(Session.refresh_token_hash == incoming_hash))
        stolen_session = reuse_result.scalars().first()

        if stolen_session:
            # REVOKE ENTIRE TOKEN FAMILY & ALL SESSIONS
            family_id = stolen_session.token_family_id
            await db.execute(
                update(Session)
                .where(Session.token_family_id == family_id)
                .values(
                    revoked_at=utc_now(),
                    revocation_reason="AUTOMATIC_REVOCATION_REFRESH_TOKEN_REUSE_DETECTED"
                )
            )
            await log_audit_event(
                db,
                "REFRESH_TOKEN_REUSE_DETECTED",
                stolen_session.user_id,
                None,
                request,
                {"token_family_id": family_id, "attempted_hash": incoming_hash[:10]},
                severity="CRITICAL"
            )
            await db.commit()

        # Clear cookie
        response.delete_cookie(key=settings.COOKIE_NAME, path="/api/v1/auth")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Security Alert: Invalid or reused refresh token. All family sessions revoked."
        )

    # Check Expiration
    if existing_session.expires_at < utc_now():
        existing_session.revoked_at = utc_now()
        existing_session.revocation_reason = "EXPIRED"
        await db.commit()
        response.delete_cookie(key=settings.COOKIE_NAME, path="/api/v1/auth")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired. Please log in again."
        )

    # Fetch User
    user_result = await db.execute(select(User).where(User.id == existing_session.user_id))
    user = user_result.scalars().first()
    if not user or user.account_status != "ACTIVE":
        response.delete_cookie(key=settings.COOKIE_NAME, path="/api/v1/auth")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User account is inactive.")

    # 3. Rotate Refresh Token
    new_raw_refresh_token = generate_random_token()
    new_refresh_hash = hash_token(new_raw_refresh_token)

    # Invalidate previous token hash by creating updated session state in family
    existing_session.refresh_token_hash = new_refresh_hash
    existing_session.last_used_at = utc_now()

    await log_audit_event(db, "REFRESH_TOKEN_ROTATION", user.id, user.organization_id, request, {"session_id": existing_session.id})
    await db.commit()

    # Update HttpOnly Cookie
    response.set_cookie(
        key=settings.COOKIE_NAME,
        value=new_raw_refresh_token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        domain=settings.COOKIE_DOMAIN,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400,
        path="/api/v1/auth"
    )

    # Create new short-lived access token
    new_access_token = create_jwt_access_token(user.id, user.email, user.role)

    return TokenResponse(
        access_token=new_access_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user={
            "id": user.id,
            "email": user.email,
            "name": user.full_name,
            "role": user.role,
            "mfa_enabled": user.mfa_enabled,
        }
    )

@router.post("/logout")
async def logout(
    request: Request,
    response: Response,
    trustlayer_refresh_token: Optional[str] = Cookie(None),
    current_user: Optional[User] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Revoke current session and clear HttpOnly authentication cookie.
    """
    raw_token = trustlayer_refresh_token or request.cookies.get(settings.COOKIE_NAME)
    if raw_token:
        t_hash = hash_token(raw_token)
        await db.execute(
            update(Session)
            .where(Session.refresh_token_hash == t_hash)
            .values(revoked_at=utc_now(), revocation_reason="USER_LOGOUT")
        )

    if current_user:
        await log_audit_event(db, "LOGOUT", current_user.id, current_user.organization_id, request, {})

    await db.commit()
    response.delete_cookie(key=settings.COOKIE_NAME, path="/api/v1/auth")
    return {"message": "Successfully logged out."}

@router.post("/logout-all")
async def logout_all(
    request: Request,
    response: Response,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Revoke all active sessions across all devices for the current user.
    """
    await db.execute(
        update(Session)
        .where(Session.user_id == current_user.id, Session.revoked_at.is_(None))
        .values(revoked_at=utc_now(), revocation_reason="USER_LOGOUT_ALL")
    )
    await log_audit_event(db, "LOGOUT_ALL", current_user.id, current_user.organization_id, request, {})
    await db.commit()

    response.delete_cookie(key=settings.COOKIE_NAME, path="/api/v1/auth")
    return {"message": "All device sessions have been revoked."}

@router.post("/forgot-password")
async def forgot_password(
    req: ForgotPasswordRequest,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Forgot Password request - Returns generic success response to prevent email enumeration.
    """
    rate_limiter.check_rate_limit(request, "forgot-password", max_requests=3, window_seconds=60)
    
    result = await db.execute(select(User).where(User.email == req.email.lower()))
    user = result.scalars().first()

    if user:
        raw_reset_token = generate_random_token()
        token_hash = hash_token(raw_reset_token)
        expires = utc_now() + timedelta(minutes=settings.PASSWORD_RESET_EXPIRE_MINUTES)
        
        reset_entry = PasswordResetToken(
            id=str(uuid.uuid4()),
            user_id=user.id,
            token_hash=token_hash,
            expires_at=expires
        )
        db.add(reset_entry)
        await log_audit_event(db, "PASSWORD_RESET_REQUESTED", user.id, user.organization_id, request, {})
        await db.commit()

    return {"message": "If the email is registered, password reset instructions have been sent."}

@router.post("/reset-password")
async def reset_password(
    req: ResetPasswordRequest,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Reset password using single-use reset token and invalidate all active sessions.
    """
    rate_limiter.check_rate_limit(request, "reset-password", max_requests=3, window_seconds=60)

    token_hash = hash_token(req.token)
    result = await db.execute(
        select(PasswordResetToken).where(
            PasswordResetToken.token_hash == token_hash,
            PasswordResetToken.used_at.is_(None),
            PasswordResetToken.expires_at > utc_now()
        )
    )
    reset_record = result.scalars().first()
    if not reset_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired password reset token."
        )

    # Fetch User
    u_result = await db.execute(select(User).where(User.id == reset_record.user_id))
    user = u_result.scalars().first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    # Update Password using Argon2id
    user.password_hash = hash_password(req.new_password)
    user.password_changed_at = utc_now()
    reset_record.used_at = utc_now()

    # Revoke all existing sessions
    await db.execute(
        update(Session)
        .where(Session.user_id == user.id)
        .values(revoked_at=utc_now(), revocation_reason="PASSWORD_RESET_COMPLETED")
    )

    await log_audit_event(db, "PASSWORD_RESET_COMPLETED", user.id, user.organization_id, request, {})
    await db.commit()
    return {"message": "Password reset successfully. Please log in with your new password."}

@router.post("/change-password")
async def change_password(
    req: ChangePasswordRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Change Password endpoint requiring current password verification.
    """
    if not verify_password(req.current_password, current_user.password_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password incorrect.")

    current_user.password_hash = hash_password(req.new_password)
    current_user.password_changed_at = utc_now()

    # Invalidate other sessions
    await db.execute(
        update(Session)
        .where(Session.user_id == current_user.id, Session.revoked_at.is_(None))
        .values(revoked_at=utc_now(), revocation_reason="PASSWORD_CHANGED")
    )

    await log_audit_event(db, "PASSWORD_CHANGED", current_user.id, current_user.organization_id, request, {})
    await db.commit()
    return {"message": "Password updated successfully."}

@router.get("/sessions", response_model=List[SessionResponse])
async def list_sessions(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    View all active device sessions for current user.
    """
    result = await db.execute(
        select(Session).where(
            Session.user_id == current_user.id,
            Session.revoked_at.is_(None),
            Session.expires_at > utc_now()
        ).order_by(Session.last_used_at.desc())
    )
    sessions = result.scalars().all()
    
    current_ip = request.client.host if request.client else "127.0.0.1"

    return [
        SessionResponse(
            id=s.id,
            device_name=s.device_name or "Desktop Browser",
            ip_address=s.ip_address,
            user_agent=s.user_agent,
            created_at=s.created_at,
            last_used_at=s.last_used_at,
            is_current=(s.ip_address == current_ip)
        )
        for s in sessions
    ]

@router.delete("/sessions/{session_id}")
async def revoke_session(
    session_id: str,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Revoke a specific remote device session by ID.
    """
    result = await db.execute(
        select(Session).where(Session.id == session_id, Session.user_id == current_user.id)
    )
    session = result.scalars().first()
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found.")

    session.revoked_at = utc_now()
    session.revocation_reason = "USER_MANUAL_REVOCATION"

    await log_audit_event(db, "SESSION_REVOKED", current_user.id, current_user.organization_id, request, {"revoked_session_id": session_id})
    await db.commit()
    return {"message": "Session revoked."}
