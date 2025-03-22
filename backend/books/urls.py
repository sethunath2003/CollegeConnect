# This file defines URL patterns for the books application
from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from .views import BookViewSet

# Set up the DRF router for automatic URL routing
router = DefaultRouter()
# Register the BookViewSet with an explicit 'api' endpoint to avoid conflicts
router.register(r'api', BookViewSet)

# Define URL patterns for the books application
urlpatterns = [
    # Root URL displays the main books index/listing page
    path('', views.index, name='book-list'),
    # URL for posting/creating a new book
    path('post/', views.BookPostView.as_view(), name='book-post'),
    # URL for selecting/viewing a specific book by ID
    path('select/<int:book_id>/', views.select_book, name='select_book'),
    # Include all DRF API routes under the 'api/' prefix
    path('', include(router.urls)),
]