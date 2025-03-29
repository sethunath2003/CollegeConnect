import requests
import json
import time
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from .models import Event
from django.db import IntegrityError

def scrape_events():
    """Scrape events from reskilll.com and save to database"""
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
    created_count = 0
    for card in event_list:
        title_tag = card.find("a", class_="allhackname eventName text-decoration-none")
        title = title_tag.text.strip() if title_tag else "No title found"

        image_tag = card.find("img", class_="allhacksbanner")
        image_url = urljoin(url, image_tag["src"]) if image_tag and "src" in image_tag.attrs else None

        description_tag = card.find("div", class_="eventDescription")
        description = description_tag.text.strip() if description_tag else None

        registration_dates = card.find_all("div", class_="hackresgiterdate")
        registration_start = registration_dates[0].text.strip() if len(registration_dates) > 0 else None
        registration_end = registration_dates[1].text.strip() if len(registration_dates) > 1 else None

        event_url = title_tag["href"] if title_tag and "href" in title_tag.attrs else None
        
        # Create or update event in database
        try:
            event, created = Event.objects.update_or_create(
                title=title,
                defaults={
                    'description': description,
                    'image_url': image_url,
                    'link': event_url or url,
                    'event_url': event_url,
                    'registration_start': registration_start,
                    'registration_end': registration_end,
                }
            )
            if created:
                created_count += 1
                
            # Add to response list
            events.append({
                "id": event.id,
                "title": title,
                "image_url": image_url,
                "description": description,
                "registration_start": registration_start,
                "registration_end": registration_end,
                "link": event_url
            })
        except IntegrityError as e:
            print(f"❌ Could not save event {title}: {e}")

    print(f"✅ Found {len(events)} events. Created {created_count} new events.")
    return events

# Run Scraper
if __name__ == "__main__":
    scrape_events()
