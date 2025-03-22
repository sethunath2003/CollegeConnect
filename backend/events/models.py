from django.db import models

class Event(models.Model):
    """Model to store event details"""
    title = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    link = models.URLField()
    button_text = models.CharField(max_length=50)

    def __str__(self):
        return self.title
