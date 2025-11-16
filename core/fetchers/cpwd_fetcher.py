import requests
from bs4 import BeautifulSoup
from typing import Optional

def fetch_cpwd_price(item_keyword: str) -> Optional[float]:
    """
    Attempt to fetch unit price from CPWD publications page.
    Real SOR/AOR are PDFs/Excels; for a demo, show connectivity and
    then rely on a curated offline cache or a pre-parsed SOR file you include.
    """
    try:
        url = "https://cpwd.gov.in/Documents/cpwd_publication.aspx"
        resp = requests.get(url, timeout=10)
        if resp.status_code != 200:
            return None
        return None
    except Exception:
        return None