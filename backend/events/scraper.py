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
        return []

    soup = BeautifulSoup(response.text, "html.parser")

    # ✅ Find the main event list container
    event_list = soup.find_all("div", class_="hackathonCard")
    if not event_list:
        print("❌ No event list found. Check if the class has changed.")
        return []

    events = []
    for card in event_list:
        # 🔍 Extract event title
        title_tag = card.find("a", class_="allhackname")
        title = title_tag.text.strip() if title_tag else "No title found"

        # 🔍 Extract event image URL
        image_tag = card.find("img")
        image_url = urljoin(url, image_tag["src"]) if image_tag and "src" in image_tag.attrs else "No image"

        # 🔍 Extract event description
        description_tag = card.find("div", class_="eventDescription")
        description = description_tag.text.strip() if description_tag else "No description found"

        # 🔍 Extract registration start and end dates
        registration_start_tag = card.find_all("div", class_="hackresgiterdate")[0]
        registration_start = registration_start_tag.text.strip() if registration_start_tag else "No start date found"

        registration_end_tag = card.find_all("div", class_="hackresgiterdate")[1]
        registration_end = registration_end_tag.text.strip() if registration_end_tag else "No end date found"

        # 🔍 Extract event link
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

    # ✅ Save data to JSON
    save_to_json(events)

    print(f"✅ Found {len(events)} events and saved to events.json.")
    return events

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

def test_scrape_events():
    """Test the scrape_events function and print the results."""
    events = scrape_events()
    if events:
        print(f"✅ Test successful: Found {len(events)} events.")
    else:
        print("❌ Test failed: No events found.")

if __name__ == "__main__":
    scrape_events()  # Run immediately
    test_scrape_events()  # Run the test
    # Uncomment this if you want it to run automatically
    # schedule_scraper()
