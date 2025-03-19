from django.db import models

class Event(models.Model):
    """Model to store event details"""
    title = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    link = models.URLField()
    button_text = models.CharField(max_length=50)
    image = models.URLField()  # New field for image URL
    registration_start = models.DateField()  # New field for registration start date
    registration_end = models.DateField()  # New field for registration end date

    def __str__(self):
        return self.title
