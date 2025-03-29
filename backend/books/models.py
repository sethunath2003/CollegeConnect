# This file defines the data model for books in the database
from django.db import models

class Book(models.Model):
    # Book title with maximum 150 characters
    title = models.CharField(max_length=150)
    
    # Book description with unlimited length
    description = models.TextField()
    
    # Location where the book is available (campus location, building, etc)
    location = models.CharField(max_length=150)
    
    # Numerical cost of the book - can be 0 for free items
    cost = models.FloatField()
    
    # Name of the person who owns the book, defaults to 'Unknown' if not specified
    owner_name = models.CharField(max_length=150, default='Unknown')
    
    # Name of the person who has booked/reserved the book (optional)
    booker_name = models.CharField(max_length=150, blank=True, null=True)
    
    # Email of the person who has booked/reserved the book (optional)
    booker_email = models.CharField(max_length=150, blank=True, null=True)
    
    # Field for uploading and storing book cover images
    cover_image = models.ImageField(upload_to='book_covers/', blank=True, null=True)

    # String representation of the Book model for admin interface and debugging
    def __str__(self):
        return self.title
