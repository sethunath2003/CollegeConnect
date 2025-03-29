# This file defines Django forms for the books app
from django import forms
from .models import Book

class BookForm(forms.ModelForm):
    """Form for creating and editing books"""
    class Meta:
        # The model this form is based on
        model = Book
        # Fields to include in the form
        fields = ['title', 'description', 'location', 'cost', 'owner_name', 'cover_image']
        # Custom labels for form fields
        labels = {
            'owner_name': 'Your Name',
            'cover_image': 'Book Cover Image (JPG)',
        }

class BookerForm(forms.ModelForm):
    """Form for booking a book"""
    class Meta:
        # The model this form is based on
        model = Book
        # Only include booker fields
        fields = ['booker_name', 'booker_email']