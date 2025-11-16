import requests
from bs4 import BeautifulSoup
from typing import Optional, Tuple

def find_irc_clause_url(clause_text: str) -> Tuple[Optional[str], Optional[str]]:
    if not clause_text:
        return None, None

    q = clause_text.replace(" ", "+")
    candidates = [
        f"https://www.irc.nic.in/",
        "https://law.resource.org/pub/in/bis/manifest.irc.html",
        "https://morth.nic.in/hi/node/120",
    ]

    for url in candidates:
        try:
            resp = requests.get(url, timeout=10)
            if resp.status_code == 200:
                soup = BeautifulSoup(resp.text, "lxml")
                title = soup.title.text.strip() if soup.title else "IRC Reference"
                return url, title
        except Exception:
            continue

    return None, None