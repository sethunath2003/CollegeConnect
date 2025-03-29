import requests
import json
import time
import schedule
from bs4 import BeautifulSoup
from urllib.parse import urljoin

def scrape_events():
    url = "https://reskilll.com/allhacks"
    headers = {"User-Agent": "Mozilla/5.0"}

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        print(f"✅ Successfully fetched page: {response.status_code}")
    except requests.RequestException as e:
        print(f"❌ Failed to fetch page: {e}")
        return []

    soup = BeautifulSoup(response.text, "html.parser")
    event_list = soup.find_all("div", class_="hackathonCard")

    if not event_list:
        print("❌ No event list found. Check if the class has changed.")
        return []

    events = []
    for card in event_list:
        title_tag = card.find("a", class_="allhackname eventName text-decoration-none")
        title = title_tag.get_text(strip=True) if title_tag else "No title found"

        image_tag = card.find("img", class_="allhacksbanner")
        image_url = urljoin(url, image_tag["src"]) if image_tag and "src" in image_tag.attrs else "No image"

        description_tag = card.find("div", class_="eventDescription")
        description = description_tag.get_text(strip=True) if description_tag else "No description"

        registration_dates = card.find_all("div", class_="hackresgiterdate")
        registration_start = registration_dates[0].get_text(strip=True) if len(registration_dates) > 0 else "No start date"
        registration_end = registration_dates[1].get_text(strip=True) if len(registration_dates) > 1 else "No end date"

        link_tag = title_tag["href"] if title_tag and "href" in title_tag.attrs else "No link"

        events.append({
            "title": title,
            "image": image_url,
            "description": description,
            "registration_start": registration_start,
            "registration_end": registration_end,
            "event_url": link_tag
        })

    save_to_json(events)
    print(f"✅ Found {len(events)} events and saved to events.json.")
    return events

def save_to_json(events, filename="events.json"):
    """Save event data to a JSON file"""
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(events, f, indent=4, ensure_ascii=False)

# Run Scraper
if __name__ == "__main__":
    scrape_events()
