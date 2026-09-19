import os
from pydantic_settings import BaseSettings
from typing import List, Optional

class Settings(BaseSettings):
    APP_NAME: str = "TrustLayerLabs Security Gateway"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Database Settings (PostgreSQL with SQLite fallback)
    DATABASE_URL: str = "sqlite+aiosqlite:///./trustlayer_security.db"
    POSTGRES_USER: Optional[str] = "trustlayer"
    POSTGRES_PASSWORD: Optional[str] = "trustlayer_secure_pass_2026"
    POSTGRES_DB: Optional[str] = "trustlayer_labs_db"
    POSTGRES_HOST: Optional[str] = "localhost"
    POSTGRES_PORT: Optional[int] = 5432

    # JWT Settings (Short-Lived Access Tokens)
    JWT_SECRET_KEY: str = "trustlayer_super_secret_rsa_fallback_key_2026_9849201"
    JWT_ALGORITHM: str = "HS256"
    JWT_ISSUER: str = "trustlayerlabs-api"
    JWT_AUDIENCE: str = "trustlayerlabs-web"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15  # 5-15 min recommended

    # Refresh Token Cookie Settings (Rotating & HttpOnly)
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    COOKIE_NAME: str = "trustlayer_refresh_token"
    COOKIE_SECURE: bool = False  # Set to True in HTTPS production
    COOKIE_SAMESITE: str = "lax"  # lax or strict
    COOKIE_DOMAIN: Optional[str] = None

    # CORS Settings
    CORS_ORIGINS: List[str] = [
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://www.trustlayerlabs.co.in",
        "https://trustlayerlabs.co.in",
    ]

    # Security Lockout Parameters
    MAX_LOGIN_ATTEMPTS: int = 5
    LOCKOUT_DURATION_MINUTES: int = 15

    # Password Reset Expiry
    PASSWORD_RESET_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
