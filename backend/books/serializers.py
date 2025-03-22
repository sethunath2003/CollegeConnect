from rest_framework import serializers
from .models import Book

class BookSerializer(serializers.ModelSerializer):
    """
    Serializer for the Book model.
    Handles conversion between Book model instances and JSON.
    """
    # Make image field optional
    image = serializers.ImageField(required=False)
    
    class Meta:
        model = Book
        fields = '__all__'
        # Make sure these fields are not required if they have defaults or can be null
        extra_kwargs = {
            'booker_name': {'required': False},
            'booker_email': {'required': False},
        }

    def create(self, validated_data):
        # Handle image separately if it's causing issues
        image = validated_data.pop('image', None)
        book = Book.objects.create(**validated_data)
        if image:
            book.image = image
            book.save()
        return book