import json
import os
import redis
from dotenv import load_dotenv

load_dotenv()

_client: redis.Redis | None = None


def get_redis() -> redis.Redis | None:
    global _client
    if _client is not None:
        return _client

    url = os.getenv("UPSTASH_REDIS_URL")
    if not url:
        print("[cache] UPSTASH_REDIS_URL not set — running without cache")
        return None

    try:
        _client = redis.from_url(url, decode_responses=True)
        _client.ping()
        print("[cache] Connected to Upstash Redis")
        return _client
    except Exception as e:
        print(f"[cache] Redis connection failed: {e} — running without cache")
        return None


def cache_get(key: str) -> dict | list | None:
    client = get_redis()
    if client is None:
        return None
    try:
        val = client.get(key)
        return json.loads(val) if val else None
    except Exception:
        return None


def cache_set(key: str, value: dict | list, ttl: int) -> None:
    client = get_redis()
    if client is None:
        return
    try:
        client.setex(key, ttl, json.dumps(value))
    except Exception:
        pass


def cache_delete(key: str) -> None:
    client = get_redis()
    if client is None:
        return
    try:
        client.delete(key)
    except Exception:
        pass