import os
import sys
import json
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from typing import List, Optional
from datetime import datetime, timedelta, timezone
from pydantic import BaseModel

from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func

from database import get_db
from models import User, Session, AuditLog
from security.rbac import get_current_user, require_permission

router = APIRouter(prefix="/api/v1/admin/security", tags=["Security Monitoring"])

class SecurityMetricsResponse(BaseModel):
    total_users: int
    active_sessions_count: int
    failed_logins_24h: int
    suspicious_token_reuse_count: int
    locked_accounts_count: int

class AuditLogEntryResponse(BaseModel):
    id: str
    timestamp: datetime
    event_type: str
    user_id: Optional[str]
    user_email: Optional[str]
    ip_address: Optional[str]
    details: Optional[dict]
    severity: str

@router.get("/dashboard", response_model=SecurityMetricsResponse)
async def get_security_metrics(
    current_user: User = Depends(require_permission("audit:read")),
    db: AsyncSession = Depends(get_db)
):
    """
    Returns security dashboard aggregate metrics for system administrators.
    """
    now = datetime.now(timezone.utc)
    since_24h = now - timedelta(hours=24)

    # 1. Total users
    res_users = await db.execute(select(func.count(User.id)))
    total_users = res_users.scalar() or 0

    # 2. Active sessions count
    res_sessions = await db.execute(
        select(func.count(Session.id)).where(Session.revoked_at.is_(None), Session.expires_at > now)
    )
    active_sessions_count = res_sessions.scalar() or 0

    # 3. Failed logins in 24h
    res_failed = await db.execute(
        select(func.count(AuditLog.id)).where(
            AuditLog.event_type == "LOGIN_FAILED",
            AuditLog.timestamp >= since_24h
        )
    )
    failed_logins_24h = res_failed.scalar() or 0

    # 4. Token reuse detections
    res_reuse = await db.execute(
        select(func.count(AuditLog.id)).where(
            AuditLog.event_type == "REFRESH_TOKEN_REUSE_DETECTED"
        )
    )
    suspicious_token_reuse_count = res_reuse.scalar() or 0

    # 5. Locked accounts
    res_locked = await db.execute(
        select(func.count(User.id)).where(User.account_status == "LOCKED")
    )
    locked_accounts_count = res_locked.scalar() or 0

    return SecurityMetricsResponse(
        total_users=total_users,
        active_sessions_count=active_sessions_count,
        failed_logins_24h=failed_logins_24h,
        suspicious_token_reuse_count=suspicious_token_reuse_count,
        locked_accounts_count=locked_accounts_count
    )

@router.get("/audit-logs", response_model=List[AuditLogEntryResponse])
async def get_audit_logs(
    limit: int = 50,
    severity: Optional[str] = None,
    current_user: User = Depends(require_permission("audit:read")),
    db: AsyncSession = Depends(get_db)
):
    """
    Fetch security event audit trail for administration.
    """
    query = select(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit)
    if severity:
        query = query.where(AuditLog.severity == severity.upper())

    result = await db.execute(query)
    logs = result.scalars().all()

    response_list = []
    for log in logs:
        user_email = None
        if log.user_id:
            u_res = await db.execute(select(User.email).where(User.id == log.user_id))
            user_email = u_res.scalar()

        parsed_details = None
        if log.details:
            try:
                parsed_details = json.loads(log.details)
            except Exception:
                parsed_details = {"raw": log.details}

        response_list.append(
            AuditLogEntryResponse(
                id=log.id,
                timestamp=log.timestamp,
                event_type=log.event_type,
                user_id=log.user_id,
                user_email=user_email,
                ip_address=log.ip_address,
                details=parsed_details,
                severity=log.severity
            )
        )

    return response_list
