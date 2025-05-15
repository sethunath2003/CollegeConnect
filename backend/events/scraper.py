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

def scrape_events():
    """Scrape events from reskilll.com and devfolio.co and save to database"""
    websites = ["https://reskilll.com/allhacks",]
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0"
    }

    all_events = []
    created_count = 0

    for url in websites:
        try:
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            print(f"Scraping: {url}")
            
            if "reskilll.com" in url:
                events = parse_reskilll(response.text, url)
            
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
                    event_data["newly_created"] = created  # Add this line to track if this event is new
                    all_events.append(event_data)
                except IntegrityError as e:
                    print(f"❌ Could not save event {event_data['title']}: {e}")
                    
        except requests.RequestException as e:
            print(f"Error fetching {url}: {e}")

    print(f"✅ Found {len(all_events)} events. Created {created_count} new events.")
    return all_events

def parse_reskilll(html_content, base_url):
    """Parse events from reskilll.com"""
    soup = BeautifulSoup(html_content, "html.parser")
    event_list = soup.find_all("div", class_="hackathonCard")
    
    if not event_list:
        print("No events found on Reskilll.")
        return []
    
    events = []
    for card in event_list:
        title_tag = card.find("a", class_="allhackname eventName text-decoration-none")
        title = title_tag.get_text(strip=True) if title_tag else "No title found"

        image_tag = card.find("img", class_="allhacksbanner")
        image_url = urljoin(base_url, image_tag["src"]) if image_tag and "src" in image_tag.attrs else None

        description_tag = card.find("div", class_="eventDescription")
        description = description_tag.get_text(strip=True) if description_tag else "No description"

        registration_dates = card.find_all("div", class_="hackresgiterdate")
        registration_start = registration_dates[0].get_text(strip=True) if len(registration_dates) > 0 else "No start date"
        registration_end = registration_dates[1].get_text(strip=True) if len(registration_dates) > 1 else "No end date"

        event_url = title_tag["href"] if title_tag and "href" in title_tag.attrs else None
        
        events.append({
            "title": title,
            "image_url": image_url,
            "description": description,
            "registration_start": registration_start,
            "registration_end": registration_end,
            "link": event_url
        })
    
    return events


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
