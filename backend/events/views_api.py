from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from .models import Event
from .serializers import EventSerializer


@api_view(['GET'])
def list_events(request):
    """Return a paginated list of events as JSON."""
    qs = Event.objects.order_by('-id')
    paginator = PageNumberPagination()
    paginator.page_size = 20
    result_page = paginator.paginate_queryset(qs, request)
    serializer = EventSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)
