from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Event
from unittest.mock import patch
import requests

class EventAPITestCase(APITestCase):

    def setUp(self):
        """Set up initial data for tests"""
        self.event = Event.objects.create(
            title="Test Event",
            description="This is a test event.",
            link="https://example.com",
            button_text="Register"
        )

    def tearDown(self):
        """Clean up database after each test"""
        Event.objects.all().delete()

    def test_event_list(self):
        """Test retrieving the list of events"""
        url = reverse('event-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_scraper(self):
        """Test that scraper runs successfully and stores data"""
        url = reverse('run-scraper')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(Event.objects.exists())

    def test_scraper_creates_unique_events(self):
        """Test that scraper does not create duplicate events"""
        url = reverse('run-scraper')
        self.client.get(url)
        self.client.get(url)
        event_count = Event.objects.count()
        unique_titles = Event.objects.values_list('title', flat=True).distinct()
        self.assertEqual(event_count, len(unique_titles))

    @patch("events.scraper.requests.get")
    def test_invalid_scraper_response(self, mock_get):
        """Test handling of scraper failure"""
        mock_get.side_effect = requests.RequestException("Failed request")
        url = reverse('run-scraper')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
