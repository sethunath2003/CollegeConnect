from django.urls import path
from .views import EventListView, run_scraper
from .views_api import list_events

urlpatterns = [
    path('events/', EventListView.as_view(), name='event-list'),  # List of stored events (HTML)
    path('scrape/', run_scraper, name='run-scraper'),  # Runs the scraper and returns latest data
    path('api/events/', list_events, name='api-event-list'),  # JSON paginated events for frontend
]
