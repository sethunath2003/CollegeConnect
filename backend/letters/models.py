from django.db import models
from django.contrib.auth.models import User

class LetterDraft(models.Model):
    """
    Model to store letter drafts created by users.
    
    This model represents drafts of various types of letters that users
    can create, edit, and generate as PDFs later.
    """
    # Available letter types with their display names
    LETTER_TYPES = [
        ('application', 'Application Letter'),
        ('internship', 'Internship Request'),
        ('recommendation', 'Recommendation Request'),
        ('leave', 'Leave Application'),
        ('permission', 'Permission Letter'),
        ('custom', 'Custom Letter'),
    ]
    
    # Foreign key to User model, linking each draft to its creator
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='letter_drafts')
    
    # Type of letter (selected from LETTER_TYPES choices)
    letter_type = models.CharField(max_length=20, choices=LETTER_TYPES)
    
    # JSON field to store template-specific form data
    template_data = models.JSONField()  # Store form data as JSON
    
    # Timestamps for creation and last update
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        """String representation of the LetterDraft object"""
        return f"{self.letter_type} by {self.user.username}"
