import logging
from django.http import JsonResponse
from rest_framework import generics
from .models import Event
from .serializers import EventSerializer
from .scraper import scrape_events

# Set up logging
logger = logging.getLogger(__name__)

class EventListView(generics.ListAPIView):
    """API View to list all events"""
    queryset = Event.objects.all()
    serializer_class = EventSerializer

def run_scraper(request):
    """API View to trigger the web scraper"""
    status, events = scrape_events()
    logger.info(f"Scraped events: {events}")
    print(f"Scraped events: {events}")
    return JsonResponse({"status": status, "events": events})

def get_scraped_events(request):
    """API View to get the scraped events"""
    status, events = scrape_events()
    if status == "success":
        logger.info(f"Scraped events: {events}")
        print(f"Scraped events: {events}")
        return JsonResponse({"events": events})
    else:
        logger.error("Failed to scrape events")
        return JsonResponse({"error": "Failed to scrape events"}, status=500)

def get_events(request):
    events = Event.objects.all().values()
    return JsonResponse(list(events), safe=False)

def create_event(request):
    if request.method == 'POST':
        # Handle event creation logic here
        pass
    return JsonResponse({"message": "Event created"})
