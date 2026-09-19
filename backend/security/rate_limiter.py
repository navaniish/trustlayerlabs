import time
from collections import defaultdict
from fastapi import Request, HTTPException, status
from config import settings

class InMemRateLimiter:
    """
    Lightweight, sliding window rate limiter tracking request frequencies per IP and endpoint.
    """
    def __init__(self):
        # Key: (ip, endpoint), Value: list of timestamps
        self.requests = defaultdict(list)

    def check_rate_limit(self, request: Request, endpoint_key: str, max_requests: int = 5, window_seconds: int = 60):
        client_ip = request.client.host if request.client else "127.0.0.1"
        key = f"{client_ip}:{endpoint_key}"
        now = time.time()
        
        # Filter timestamps within sliding window
        window_start = now - window_seconds
        self.requests[key] = [t for t in self.requests[key] if t > window_start]
        
        if len(self.requests[key]) >= max_requests:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many authentication requests. Please try again in 1 minute."
            )
        
        self.requests[key].append(now)

rate_limiter = InMemRateLimiter()
