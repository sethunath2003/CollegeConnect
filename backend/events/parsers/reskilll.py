from bs4 import BeautifulSoup
from urllib.parse import urljoin


def parse_reskilll(html_content, base_url):
    """Parse events from reskilll.com and return normalized event dicts."""
    soup = BeautifulSoup(html_content, "html.parser")
    event_list = soup.find_all("div", class_="hackathonCard")

    if not event_list:
        return []

    events = []
    for card in event_list:
        title_tag = card.find("a", class_="allhackname eventName text-decoration-none")
        title = title_tag.get_text(strip=True) if title_tag else "No title found"

        image_tag = card.find("img", class_="allhacksbanner")
        image_url = urljoin(base_url, image_tag["src"]) if image_tag and "src" in image_tag.attrs else None

        description_tag = card.find("div", class_="eventDescription")
        description = description_tag.get_text(strip=True) if description_tag else ""

        registration_dates = card.find_all("div", class_="hackresgiterdate")
        registration_start = registration_dates[0].get_text(strip=True) if len(registration_dates) > 0 else None
        registration_end = registration_dates[1].get_text(strip=True) if len(registration_dates) > 1 else None

        event_url = title_tag["href"] if title_tag and "href" in title_tag.attrs else None

        events.append({
            "title": title,
            "image_url": image_url,
            "description": description,
            "registration_start": registration_start,
            "registration_end": registration_end,
            "link": event_url,
            "_raw_snippet": str(card)[:200],
        })

    return events
