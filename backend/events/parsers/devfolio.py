from bs4 import BeautifulSoup
from urllib.parse import urljoin


def parse_devfolio(html_content, base_url):
    """Minimal parser for Devfolio listing pages. Returns normalized event dicts.
    This is intentionally conservative; Devfolio markup varies and should be extended
    with concrete samples later.
    """
    soup = BeautifulSoup(html_content, "html.parser")
    # Try to locate project / event cards; this selector may need refinement
    cards = soup.find_all("a", class_="project-card-link") or []
    events = []
    for c in cards:
        title = c.get_text(strip=True) or "No title"
        href = c.get("href")
        link = urljoin(base_url, href) if href else base_url
        events.append({
            "title": title,
            "link": link,
            "description": "",
            "image_url": None,
            "registration_start": None,
            "registration_end": None,
            "_raw_snippet": str(c)[:200],
        })
    return events
