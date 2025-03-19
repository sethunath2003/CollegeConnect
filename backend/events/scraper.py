import requests
import json
import time
import schedule
from bs4 import BeautifulSoup
from urllib.parse import urljoin

def scrape_events():
    url = "https://reskilll.com/allhacks"  # Update if the URL changes
    headers = {"User-Agent": "Mozilla/5.0"}  # Helps prevent bot blocking

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()  # Raise an error for HTTP issues
    except requests.RequestException as e:
        print(f"❌ Failed to fetch page: {e}")
        return 500, []

    soup = BeautifulSoup(response.text, "html.parser")

    # Find all event cards inside the list
    event_cards = soup.find_all("div", class_="hackathonCard")
    if not event_cards:
        print("❌ No events found. Check the website's HTML structure!")
        return 500, []

    events = []
    for card in event_cards:
        # Extract event title
        title_tag = card.find("a", class_="eventName")
        title = title_tag.text.strip() if title_tag else "No title found"

        # Extract event image URL
        image_tag = card.find("img")
        image_url = urljoin(url, image_tag["src"]) if image_tag and "src" in image_tag.attrs else "No image"

        # Extract event description
        description_tag = card.find("div", class_="eventDescription")
        description = description_tag.text.strip() if description_tag else "No description found"

        # Extract registration start and end dates
        dates = card.find_all("div", class_="hackresgiterdate")
        registration_start = dates[0].text.strip() if len(dates) > 0 else "No start date found"
        registration_end = dates[1].text.strip() if len(dates) > 1 else "No end date found"

        # Extract event link
        link_tag = card.find("a", href=True)
        event_url = urljoin(url, link_tag["href"]) if link_tag else "No link found"

        events.append({
            "title": title,
            "image": image_url,
            "description": description,
            "registration_start": registration_start,
            "registration_end": registration_end,
            "event_url": event_url
        })

    if not events:
        print("⚠️ No new events were saved. Check scraper logic.")
        return 500, []

    # Save data to JSON
    save_to_json(events)

    print(f"✅ Found {len(events)} events and saved to events.json.")
    return 200, events

def save_to_json(events, filename="events.json"):
    """Save event data to a JSON file"""
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(events, f, indent=4, ensure_ascii=False)

# ✅ Schedule the scraper to run every day at 8 AM
def schedule_scraper():
    schedule.every().day.at("08:00").do(scrape_events)
    while True:
        schedule.run_pending()
        time.sleep(60)  # Check every minute

if __name__ == "__main__":
    status, events = scrape_events()  # Run immediately
    # Uncomment this if you want it to run automatically
    # schedule_scraper()
