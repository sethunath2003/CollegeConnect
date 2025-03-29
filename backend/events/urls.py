from django.urls import path
from .views import EventListView, run_scraper

urlpatterns = [
    path('events/', EventListView.as_view(), name='event-list'),  # List of stored events
    path('scrape/', run_scraper, name='run-scraper'),  # Runs the scraper and returns latest data
]
