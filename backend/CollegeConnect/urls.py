from django.contrib import admin
from django.urls import path, include, re_path  # Added re_path import
from django.http import HttpResponse
from django.conf import settings
from django.conf.urls.static import static

# Create a simple homepage view
def home(request):
    return HttpResponse("<h1>Welcome to CollegeConnect API</h1>")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name='home'),  # Homepage
    path('api/', include('events.urls')),  # Ensure API routes work
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
