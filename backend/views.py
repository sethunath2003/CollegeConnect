from django.http import JsonResponse
from .models import Event

def get_events(request):
    events = Event.objects.all().values()
    return JsonResponse(list(events), safe=False)

def create_event(request):
    if request.method == 'POST':
        # Handle event creation logic here
        pass
    return JsonResponse({"message": "Event created"})
