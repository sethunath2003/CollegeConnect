from django.db import models
from django.contrib.auth.models import User

# Create your models here.

# Create a profile model in your accounts app's models.py (if not already present)
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=100, blank=True)
    department = models.CharField(max_length=100, blank=True)
    degree_program = models.CharField(max_length=100, blank=True)
    semester = models.IntegerField(null=True, blank=True)
    year = models.IntegerField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.user.username}'s profile"
