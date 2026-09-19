import os
import time
import uuid
import hashlib
import hmac
import base64
import json
import jwt
from typing import Dict, Any, Optional
from datetime import datetime, timedelta, timezone

try:
    from argon2 import PasswordHasher
    from argon2.exceptions import VerifyMismatchError
    _ph = PasswordHasher(
        time_cost=3,
        memory_cost=65536,  # 64MB
        parallelism=4,
        hash_len=32,
        salt_len=16
    )
    HAS_ARGON2 = True
except ImportError:
    HAS_ARGON2 = False

from config import settings

def hash_password(password: str) -> str:
    """
    Hash password using Argon2id with PBKDF2 fallback if argon2-cffi is not installed.
    """
    if HAS_ARGON2:
        return _ph.hash(password)
    else:
        # Fallback PBKDF2-HMAC-SHA256 with 600,000 iterations for hardened security
        salt = os.urandom(16)
        pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 600000)
        return f"pbkdf2:sha256:600000${salt.hex()}${pwd_hash.hex()}"

def verify_password(password: str, hashed: str) -> bool:
    """
    Verify password against Argon2id or PBKDF2 hash.
    """
    if not hashed:
        return False

    if HAS_ARGON2 and hashed.startswith('$argon2id$'):
        try:
            return _ph.verify(hashed, password)
        except VerifyMismatchError:
            return False
        except Exception:
            return False

    if hashed.startswith('pbkdf2:sha256:'):
        try:
            parts = hashed.split('$')
            if len(parts) != 3:
                return False
            iterations = int(parts[0].split(':')[2])
            salt = bytes.fromhex(parts[1])
            expected_hash = parts[2]
            computed = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, iterations).hex()
            return hmac.compare_digest(computed, expected_hash)
        except Exception:
            return False

    # Plain SHA-256 fallback comparison for legacy/test
    hashed_input = hashlib.sha256(password.encode('utf-8')).hexdigest()
    return hmac.compare_digest(hashed_input, hashed)

def hash_token(token: str) -> str:
    """
    Compute secure SHA-256 hash of a raw token (used for storing refresh/reset tokens).
    Never store raw tokens in database.
    """
    return hashlib.sha256(token.encode('utf-8')).hexdigest()

def generate_random_token(length: int = 32) -> str:
    """
    Generate high-entropy random hex token string.
    """
    return base64.urlsafe_b64encode(uuid.uuid4().bytes + uuid.uuid4().bytes).decode('utf-8').rstrip('=')

def create_jwt_access_token(
    user_id: str,
    email: str,
    role: str,
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create a short-lived real RFC 7519 JWT access token signed with PyJWT (HS256).
    """
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    jti = str(uuid.uuid4())

    payload = {
        "sub": str(user_id),
        "jti": jti,
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
        "iss": settings.JWT_ISSUER,
        "aud": settings.JWT_AUDIENCE,
        "email": email,
        "role": role,
    }

    return jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )

def decode_jwt_access_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decode and validate a real JWT access token's signature, issuer, audience, and expiration using PyJWT.
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
            issuer=settings.JWT_ISSUER,
            audience=settings.JWT_AUDIENCE
        )
        return payload
    except Exception:
        return None

