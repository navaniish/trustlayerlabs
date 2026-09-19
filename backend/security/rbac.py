import os
import sys
import json
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from typing import List, Set, Callable
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from database import get_db
from models import User
from security.crypto import decode_jwt_access_token

security_scheme = HTTPBearer(auto_error=False)

# Roles definition
ROLE_SUPER_ADMIN = "SUPER_ADMIN"
ROLE_ADMIN = "ADMIN"
ROLE_SALES = "SALES"
ROLE_FINANCE = "FINANCE"
ROLE_STAFF = "STAFF"
ROLE_CLIENT = "CLIENT"

# Granular Permissions Mapping
ROLE_PERMISSIONS = {
    ROLE_SUPER_ADMIN: {
        "quotation:create", "quotation:read", "quotation:update", "quotation:delete",
        "invoice:create", "invoice:read", "invoice:update", "invoice:delete",
        "client:create", "client:read", "client:update", "client:delete",
        "user:create", "user:read", "user:update", "user:delete",
        "settings:update", "audit:read", "security:admin"
    },
    ROLE_ADMIN: {
        "quotation:create", "quotation:read", "quotation:update", "quotation:delete",
        "invoice:create", "invoice:read", "invoice:update", "invoice:delete",
        "client:create", "client:read", "client:update", "client:delete",
        "user:read", "settings:update", "audit:read"
    },
    ROLE_SALES: {
        "quotation:create", "quotation:read", "quotation:update",
        "client:create", "client:read", "client:update",
        "invoice:read"
    },
    ROLE_FINANCE: {
        "invoice:create", "invoice:read", "invoice:update", "invoice:delete",
        "quotation:read", "client:read", "audit:read"
    },
    ROLE_STAFF: {
        "quotation:read", "invoice:read", "client:read"
    },
    ROLE_CLIENT: {
        "quotation:read", "invoice:read"
    }
}

async def get_current_user(
    request: Request,
    auth: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    """
    FastAPI dependency that extracts and validates short-lived JWT access token from Authorization header.
    """
    token = None
    if auth and auth.credentials:
        token = auth.credentials
    else:
        # Check fallback authorization header or query token
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Missing Bearer token.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    payload = decode_jwt_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    user_id = payload["sub"]
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authenticated user account no longer exists."
        )

    if user.account_status != "ACTIVE":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is currently locked or suspended."
        )

    return user

def require_permission(required_perm: str):
    """
    Decorator dependency enforcing granular permission-based authorization (PBAC).
    """
    async def permission_checker(current_user: User = Depends(get_current_user)) -> User:
        user_role = current_user.role.upper()
        role_perms = ROLE_PERMISSIONS.get(user_role, set())

        # Check explicit custom user permissions stored in JSON
        try:
            custom_perms = set(json.loads(current_user.permissions or "[]"))
        except Exception:
            custom_perms = set()

        all_perms = role_perms.union(custom_perms)

        if required_perm not in all_perms and "security:admin" not in all_perms:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission denied. Required permission: '{required_perm}'"
            )
        return current_user

    return permission_checker

def require_role(required_roles: List[str]):
    """
    Decorator dependency enforcing role-based access control (RBAC).
    """
    async def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role.upper() not in [r.upper() for r in required_roles]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Allowed roles: {required_roles}"
            )
        return current_user

    return role_checker
