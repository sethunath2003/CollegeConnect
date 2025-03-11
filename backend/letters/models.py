from django.db import models
from django.contrib.auth.models import User

class LetterDraft(models.Model):
    LETTER_TYPES = [
        ('application', 'Application Letter'),
        ('internship', 'Internship Request'),
        ('recommendation', 'Recommendation Request'),
        ('leave', 'Leave Application'),
        ('permission', 'Permission Letter'),
        ('custom', 'Custom Letter'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='letter_drafts')
    letter_type = models.CharField(max_length=20, choices=LETTER_TYPES)
    template_data = models.JSONField()  # Store form data as JSON
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.letter_type} by {self.user.username}"
