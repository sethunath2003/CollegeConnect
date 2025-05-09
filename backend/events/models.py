from django.db import models

class Event(models.Model):
    """Model to store event details"""
    title = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    image_url = models.URLField(blank=True, null=True,max_length=2055)
    link = models.URLField(blank=True, null=True)
    registration_start = models.DateTimeField(max_length=100, blank=True, null=True)
    registration_end = models.DateTimeField(max_length=100, blank=True, null=True)
    event_url = models.URLField(blank=True, null=True)
    button_text = models.CharField(max_length=50, default="Register")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
