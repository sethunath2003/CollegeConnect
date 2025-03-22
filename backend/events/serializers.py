from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

    def validate_title(self, value):
        """Ensure event titles are unique"""
        if Event.objects.filter(title=value).exists():
            raise serializers.ValidationError("An event with this title already exists.")
        return value
