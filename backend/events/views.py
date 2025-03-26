from django.shortcuts import render
from django.views.generic import ListView
from .models import Event
import requests
from bs4 import BeautifulSoup
from django.http import JsonResponse

# Create your views here.

class EventListView(ListView):
    model = Event
    template_name = 'events/event_list.html'
    context_object_name = 'events'

def run_scraper(request):
    url = "https://reskilll.com/allhacks"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    event_list = soup.find_all("div", class_="hackathonCard")
    events = []

    for card in event_list:
        event_name_tag = card.find('a', class_='allhackname eventName')
        image_tag = card.find("img")
        event_description_tag = card.find('div', class_='eventDescription')
        registration_start_tag = card.find_all('div', class_='hackresgiterdate')[0] if len(card.find_all('div', class_='hackresgiterdate')) > 0 else None
        registration_end_tag = card.find_all('div', class_='hackresgiterdate')[1] if len(card.find_all('div', class_='hackresgiterdate')) > 1 else None
        link_tag = card.find("a", href=True)

        event_name = event_name_tag.text.strip() if event_name_tag else "No title found"
        image_url = image_tag["src"] if image_tag and "src" in image_tag.attrs else "No image"
        event_description = event_description_tag.text.strip() if event_description_tag else "No description found"
        registration_start = registration_start_tag.text.strip() if registration_start_tag else "No start date found"
        registration_end = registration_end_tag.text.strip() if registration_end_tag else "No end date found"
        event_url = link_tag["href"] if link_tag else "No link found"

        events.append({
            "title": event_name,
            "image": image_url,
            "description": event_description,
            "registration_start": registration_start,
            "registration_end": registration_end,
            "event_url": event_url
        })

    data = {
        "status": 200,
        "events": events
    }

    return JsonResponse(data, safe=False)

def home(request):
    url = "https://reskilll.com/allhacks"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    event_list = soup.find_all("div", class_="hackathonCard")
    events = []

    for card in event_list:
        event_name_tag = card.find('a', class_='allhackname eventName')
        event_description_tag = card.find('div', class_='eventDescription')
        registration_start_tag = card.find_all('div', class_='hackresgiterdate')[0] if len(card.find_all('div', class_='hackresgiterdate')) > 0 else None
        registration_end_tag = card.find_all('div', class_='hackresgiterdate')[1] if len(card.find_all('div', 'hackresgiterdate')) > 1 else None

        event_name = event_name_tag.text.strip() if event_name_tag else "N/A"
        event_description = event_description_tag.text.strip() if event_description_tag else "N/A"
        registration_start = registration_start_tag.text.strip() if registration_start_tag else "N/A"
        registration_end = registration_end_tag.text.strip() if registration_end_tag else "N/A"

        events.append({
            "event_name": event_name,
            "event_description": event_description,
            "registration_start": registration_start,
            "registration_end": registration_end
        })

    return render(request, 'events/home.html', {'events': events})
