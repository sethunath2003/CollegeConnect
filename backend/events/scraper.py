import requests
import json
import time
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from .models import Event
from django.db import IntegrityError
from django.http import JsonResponse
from rest_framework.decorators import api_view

def scrape_events():
    """Scrape events from reskilll.com and devfolio.co and save to database"""
    websites = ["https://reskilll.com/allhacks",
                "https://devfolio.co/hackathons"]
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
            elif "devfolio.co" in url:
                events = parse_devfolio(response.text, url)
            
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
        title = title_tag.text.strip() if title_tag else "No title found"

        image_tag = card.find("img", class_="allhacksbanner")
        image_url = urljoin(base_url, image_tag["src"]) if image_tag and "src" in image_tag.attrs else None

        description_tag = card.find("div", class_="eventDescription")
        description = description_tag.text.strip() if description_tag else None

        registration_dates = card.find_all("div", class_="hackresgiterdate")
        registration_start = registration_dates[0].text.strip() if len(registration_dates) > 0 else None
        registration_end = registration_dates[1].text.strip() if len(registration_dates) > 1 else None

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

def parse_devfolio(html_content, base_url):
    """Parse events from devfolio.co by extracting URLs and then scraping each event page"""
    soup = BeautifulSoup(html_content, "html.parser")
    
    # Find all link elements that might contain hackathon URLs
    event_links = []
    
    # Look for the active hackathons section first
    active_section = soup.find('h2', string=lambda s: s and ('Active' in s or 'Upcoming' in s))
    
    if active_section:
        # If we found a section for active/upcoming hackathons, focus on that
        section_parent = active_section.parent
        # Get all links in this section
        for a_tag in section_parent.find_all('a', href=True):
            href = a_tag['href']
            if '/hackathons/' in href and not href.endswith('/hackathons'):
                if not href.startswith(('http://', 'https://')):
                    href = urljoin(base_url, href)
                event_links.append(href)
    
    # If we didn't find any active hackathons, try a more general approach
    if not event_links:
        print("No active hackathon section found, trying general approach")
        
        # Look for all cards that might be hackathon listings
        cards = soup.find_all('div', class_=lambda c: c and ('card' in c.lower() or 'hackathon' in c.lower()))
        
        for card in cards:
            # Check if this card has "Active" or "Upcoming" text to filter for current hackathons
            status_text = card.text.lower()
            if 'active' in status_text or 'upcoming' in status_text or 'open' in status_text:
                a_tags = card.find_all('a', href=True)
                for a_tag in a_tags:
                    href = a_tag['href']
                    if '/hackathons/' in href and not href.endswith('/hackathons'):
                        if not href.startswith(('http://', 'https://')):
                            href = urljoin(base_url, href)
                        event_links.append(href)
    
    # If still no links, try a broader approach but filter out "past" links
    if not event_links:
        print("No links found with targeted approaches, trying broader search")
        for a_tag in soup.find_all('a', href=True):
            href = a_tag['href']
            # Make sure it's a hackathon link and not the past hackathons page
            if '/hackathons/' in href and 'past' not in href.lower() and not href.endswith('/hackathons'):
                if not href.startswith(('http://', 'https://')):
                    href = urljoin(base_url, href)
                event_links.append(href)
    
    # As a fallback, directly try to access known active hackathon URLs
    if not event_links:
        print("Adding some known active hackathon URL patterns as a fallback")
        # Try to get the current hackathons page specifically
        try:
            active_url = "https://devfolio.co/hackathons/active"
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0"
            }
            active_response = requests.get(active_url, headers=headers, timeout=10)
            active_soup = BeautifulSoup(active_response.text, "html.parser")
            
            for a_tag in active_soup.find_all('a', href=True):
                href = a_tag['href']
                if '/hackathons/' in href and not href.endswith('/hackathons'):
                    if not href.startswith(('http://', 'https://')):
                        href = urljoin(base_url, href)
                    event_links.append(href)
        except Exception as e:
            print(f"Error fetching active hackathons page: {e}")
    
    # Remove duplicates and filter out URLs with "past" in them
    event_links = [link for link in list(set(event_links)) if 'past' not in link.lower()]
    
    if not event_links:
        print("No event links found on Devfolio after trying all methods.")
        return []
    
    print(f"Found {len(event_links)} event links from Devfolio.")
    
    # Now visit each event page to extract detailed information
    events = []
    for event_url in event_links[:10]:  # Limit to 10 to avoid overloading their server
        try:
            print(f"Fetching event details from: {event_url}")
            # Add a small delay to avoid rate limiting
            time.sleep(1)
            
            # Request the event page
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0"
            }
            response = requests.get(event_url, headers=headers, timeout=10)
            response.raise_for_status()
            
            # Rest of your event parsing code remains the same
            # ...

            # The code below remains unchanged from your original function
            event_soup = BeautifulSoup(response.text, "html.parser")
            
            # Extract event title - usually in a heading element
            title_tag = event_soup.find(['h1', 'h2'], class_=lambda c: c and ('title' in c.lower() or 'name' in c.lower()))
            if not title_tag:
                title_tag = event_soup.find(['h1', 'h2'])
            title = title_tag.text.strip() if title_tag else event_url.split('/')[-1].replace('-', ' ').title()
            
            # Try to find the event image - often in meta tags or as a banner
            image_url = None
            
            # Method 1: Check meta tags for og:image
            og_image = event_soup.find('meta', property='og:image')
            if og_image and 'content' in og_image.attrs:
                image_url = og_image['content']
            
            # Method 2: Look for banner or hero images if og:image not found
            if not image_url:
                image_candidates = event_soup.find_all('img', class_=lambda c: c and any(x in c.lower() for x in ['banner', 'hero', 'cover', 'logo', 'hackathon']))
                if image_candidates:
                    for img in image_candidates:
                        if 'src' in img.attrs and img['src'] and not img['src'].endswith(('.svg', '.ico')):
                            image_url = img['src']
                            break
            
            # Ensure image_url is absolute
            if image_url and not image_url.startswith(('http://', 'https://')):
                image_url = urljoin(event_url, image_url)
            
            # Extract description
            description_tag = event_soup.find('meta', property='og:description')
            description = description_tag['content'] if description_tag and 'content' in description_tag.attrs else None
            
            if not description:
                # Try to find a description in the page content
                desc_candidates = event_soup.find_all(['p', 'div'], class_=lambda c: c and ('description' in c.lower() or 'about' in c.lower()))
                if desc_candidates:
                    description = desc_candidates[0].text.strip()
            
            # Look for dates
            registration_start = None
            registration_end = None
            
            # Look for date information in various formats
            date_tags = event_soup.find_all(['span', 'div', 'p'], string=lambda s: s and any(x in s.lower() for x in ['starts', 'begins', 'opens', 'registration', 'deadline', 'closes', 'ends']))
            
            for date_tag in date_tags:
                text = date_tag.text.lower()
                if any(x in text for x in ['start', 'begin', 'open', 'from']):
                    # This might contain the start date
                    registration_start = date_tag.text.strip()
                elif any(x in text for x in ['end', 'close', 'deadline', 'till', 'until']):
                    # This might contain the end date
                    registration_end = date_tag.text.strip()
            
            events.append({
                "title": title,
                "image_url": image_url,
                "description": description,
                "registration_start": registration_start,
                "registration_end": registration_end,
                "link": event_url
            })
            
        except Exception as e:
            print(f"Error scraping event {event_url}: {e}")
    
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
