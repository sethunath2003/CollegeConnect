# filepath: books/forms.py
from django import forms
from .models import Book

class BookForm(forms.ModelForm):
    class Meta:
        model = Book
        fields = ['title', 'description', 'location', 'cost', 'owner_name', 'cover_image']
        labels = {
            'owner_name': 'Your Name',
            'cover_image': 'Book Cover Image (JPG)',
        }

class BookerForm(forms.ModelForm):
    class Meta:
        model = Book
        fields = ['booker_name', 'booker_email']