import re
import time
from functools import lru_cache

def clean_text(s: str) -> str:
    return re.sub(r'\s+', ' ', s or '').strip()

def extract_clause(text: str) -> str:
    m = re.search(r'(IRC[:\-\w]+)[^\d]*([0-9]+(?:\.[0-9]+)*)', text or "")
    if m:
        return f"{m.group(1)} {m.group(2)}"
    return text.strip()

def now_ms() -> int:
    return int(time.time() * 1000)

@lru_cache(maxsize=256)
def cache_key(*parts):
    return "|".join(parts)