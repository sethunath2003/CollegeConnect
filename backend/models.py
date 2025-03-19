import datetime
from django.db import models
from django.utils import timezone

class Event(models.Model):
    # Other existing fields...
    registration_end = models.DateTimeField(default=timezone.now, null=False, blank=False)
    # Other existing fields...
