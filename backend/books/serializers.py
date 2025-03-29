# This file defines serializers to convert Book model instances to/from JSON
from rest_framework import serializers
from .models import Book

class BookSerializer(serializers.ModelSerializer):
    """Serializer for the Book model"""
    
    class Meta:
        # The model to serialize
        model = Book
        # Include all fields from the model
        fields = '__all__'