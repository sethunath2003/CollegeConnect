from django.shortcuts import render
from django.views.generic import ListView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from .models import Event
import requests
from bs4 import BeautifulSoup
from django.http import JsonResponse
from .scraper import scrape_events

class EventListView(APIView):
    """API view to list all events from the database"""
    
    def get(self, request):
        events = Event.objects.all().order_by('-created_at')
        # Convert to list of dictionaries for JSON response
        events_list = [{
            'id': event.id,
            'title': event.title,
            'description': event.description,
            'image_url': event.image_url,
            'link': event.link,
            'event_url': event.event_url,
            'registration_start': event.registration_start,
            'registration_end': event.registration_end,
            'button_text': event.button_text
        } for event in events]
        
        return Response({
            'count': len(events_list),
            'results': events_list
        })

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
