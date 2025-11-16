from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time
from typing import Optional, Tuple

def fetch_gem_price_live(query: str) -> Tuple[Optional[float], Optional[str]]:
    url = f"https://mkp.gem.gov.in/search?q={query}"

    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Chrome(options=options)
    driver.get(url)

    try:
        category_links = driver.find_elements(By.CSS_SELECTOR, "a")
        first_category = None
        for link in category_links:
            if "Board" in link.text or "Signage" in link.text or "Traffic" in link.text:
                first_category = link
                break

        if not first_category:
            driver.save_screenshot("debug.png")
            driver.quit()
            return None, url

        first_category.click()
        time.sleep(5)

        if "gem.gov.in" in driver.current_url and "mkp" not in driver.current_url:
            driver.save_screenshot("debug.png")
            driver.quit()
            return None, url

        try:
            price_el = driver.find_element(By.CLASS_NAME, "product-price")
        except:
            try:
                price_el = driver.find_element(By.XPATH, "//*[contains(text(),'₹')]")
            except:
                driver.save_screenshot("debug.png")
                driver.quit()
                return None, url

        raw = price_el.text.replace("₹", "").replace(",", "").strip()
        driver.quit()

        try:
            return float(raw), url
        except ValueError:
            return None, url

    except Exception:
        driver.save_screenshot("debug.png")
        driver.quit()
        return None, url