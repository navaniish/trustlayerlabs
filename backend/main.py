import uuid
import os
import sys

# Ensure backend directory is in Python path for clean module imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.future import select

from config import settings
from database import engine, Base, AsyncSessionLocal
from models import User, Organization
from security.crypto import hash_password
from routers import auth, security_dashboard

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize Database Tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Seed Default Organization and CEO Root User if empty
    async with AsyncSessionLocal() as session:
        org_result = await session.execute(select(Organization))
        org = org_result.scalars().first()
        if not org:
            org = Organization(
                id=str(uuid.uuid4()),
                name="TrustLayerLabs",
                legal_name="TrustLayer Technologies Pvt Ltd",
                gstin="36AAACT8451A1ZQ"
            )
            session.add(org)
            await session.commit()

        user_result = await session.execute(select(User).where(User.email == "ceo@trustlayerlabs.co.in"))
        ceo_user = user_result.scalars().first()
        if not ceo_user:
            ceo_user = User(
                id=str(uuid.uuid4()),
                organization_id=org.id,
                email="ceo@trustlayerlabs.co.in",
                password_hash=hash_password("Admin@123"),
                full_name="Executive Director & CEO",
                role="SUPER_ADMIN",
                permissions='["quotation:create", "quotation:read", "quotation:update", "quotation:delete", "invoice:create", "invoice:read", "invoice:update", "invoice:delete", "client:create", "client:read", "client:update", "client:delete", "user:create", "user:read", "user:update", "user:delete", "settings:update", "audit:read", "security:admin"]',
                account_status="ACTIVE"
            )
            session.add(ceo_user)
            await session.commit()

    yield

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url=None,
    lifespan=lifespan
)

# Restricted CORS Configuration (NO wildcard Access-Control-Allow-Origin: * permitted!)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Requested-With"],
    expose_headers=["Set-Cookie"]
)

# Hardened Production Security Headers Middleware
@app.middleware("http")
async def security_headers_middleware(request: Request, call_next):
    response: Response = await call_next(request)
    
    # Security Headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline'; "
        "style-src 'self' 'unsafe-inline'; "
        "img-src 'self' data: https:; "
        "font-src 'self' data:; "
        "connect-src 'self' http://localhost:3001 http://127.0.0.1:3001 http://localhost:3000 http://127.0.0.1:3000 http://localhost:5173 http://127.0.0.1:5173 http://localhost:8000 http://127.0.0.1:8000 https://trustlayerlabs.co.in; "
        "frame-ancestors 'none';"
    )
    if not settings.DEBUG:
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"
        
    return response

# Exception Handler preventing internal stack traces from leaking while preserving CORS headers
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    origin = request.headers.get("origin", "http://localhost:3001")
    headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
    }
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal security error occurred. Please contact system administrator."},
        headers=headers
    )

# Include Authentication & Security Dashboard Routers
app.include_router(auth.router)
app.include_router(security_dashboard.router)

@app.get("/health")
async def health_check():
    return {
        "status": "HEALTHY",
        "service": settings.APP_NAME,
        "environment": settings.ENVIRONMENT
    }
