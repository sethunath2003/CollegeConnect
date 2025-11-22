import requests
import json
import time
import schedule
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from .models import Event
from django.db import IntegrityError
from django.http import JsonResponse
from rest_framework.decorators import api_view

# Import site-specific parsers
from .parsers.reskilll import parse_reskilll
from .parsers.devfolio import parse_devfolio

def scrape_events():
    """Scrape events from reskilll.com and devfolio.co and save to database
    Returns a list of normalized event dicts. Keeps raw_html for debugging.
    """
    websites = [
        "https://reskilll.com/allhacks",
        "https://devfolio.co/explore",  # placeholder devfolio listing page
    ]
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0"
    }

    all_events = []
    created_count = 0

    for url in websites:
        attempt = 0
        response = None
        while attempt < 3:
            try:
                response = requests.get(url, headers=headers, timeout=10)
                response.raise_for_status()
                break
            except requests.RequestException as e:
                attempt += 1
                print(f"Attempt {attempt} failed for {url}: {e}")
                time.sleep(1 + attempt)

        if response is None:
            print(f"Giving up scraping {url} after retries.")
            continue

        print(f"Scraping: {url}")
        html = response.text

        if "reskilll.com" in url:
            events = parse_reskilll(html, url)
        elif "devfolio" in url:
            events = parse_devfolio(html, url)
        else:
            events = []

        # Save events to database
        for event_data in events:
            try:
                event, created = Event.objects.update_or_create(
                    title=event_data["title"],
                    defaults={
                        'description': event_data.get("description"),
                        'image_url': event_data.get("image_url"),
                        'link': event_data.get("link") or url,
                        'event_url': event_data.get("link"),
                        'registration_start': event_data.get("registration_start"),
                        'registration_end': event_data.get("registration_end"),
                    }
                )
                if created:
                    created_count += 1

                # Add to response list with database ID and creation status
                event_data["id"] = event.id
                event_data["newly_created"] = created
                # keep raw html snippet for debugging (optional)
                event_data["_raw_snippet"] = event_data.get("_raw_snippet")
                all_events.append(event_data)
            except IntegrityError as e:
                print(f"❌ Could not save event {event_data.get('title')}: {e}")

    print(f"✅ Found {len(all_events)} events. Created {created_count} new events.")
    return all_events


# parse_reskilll and parse_devfolio are implemented in parsers/ to keep scraper small


@api_view(['GET'])
def run_scraper(request):
    """Endpoint to trigger the scraper and return the latest events"""
    # Run the scraper and save to database
    events = scrape_events()
    
    # Count how many events have newly created=True
    new_event_count = sum(1 for event in events if event.get('newly_created', False))
    
    # Return the scraped events with count info
    return JsonResponse({
        "status": 200,
        "message": f"Successfully scraped {len(events)} events. Found {new_event_count} new events!",
        "events": events,
        "new_event_count": new_event_count,
        "total_event_count": len(events)
    })

# Run Scraper
if __name__ == "__main__":
    scrape_events()
