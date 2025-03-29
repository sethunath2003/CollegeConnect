# This file defines URL patterns for the books application
from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from .views import BookViewSet

# Set up the DRF router for automatic URL routing
router = DefaultRouter()
# Register the BookViewSet with 'books' endpoint to match frontend requests
router.register(r'books', BookViewSet, basename='book')

# Define URL patterns for the books application
urlpatterns = [
    # Root URL displays the main books index/listing page
    path('', views.index, name='book-list'),
    
    # URL for posting/creating a new book
    path('post/', views.BookPostView.as_view(), name='book-post'),
    
    # URL for selecting/viewing a specific book by ID
    path('<int:book_id>/select_book/', views.select_book, name='select_book'),
    
    # URL for viewing who booked my materials
    path('posted_by_me/', views.posted_by_me, name='posted_by_me'),
    
    # URL for viewing books booked by the current user
    path('booked_by_me/', views.booked_by_me, name='booked_by_me'),
    
    # URL for viewing details of a specific book
    path('book/<int:book_id>/', views.book_detail, name='book-detail'),
    
    # Include all DRF router URLs under the 'api/' prefix
    path('api/', include(router.urls)),
    
    # Add this line to your existing URLs
    path('books/<int:book_id>/', views.book_detail, name='book-detail'),
    
     # Delete endpoint
    path('delete/<int:book_id>/', views.delete_book, name='delete-book'),
    
    # Update endpoint
    path('update/<int:book_id>/', views.update_book, name='update-book'),
    
    # Book detail endpoint
    path('<int:book_id>/', views.book_detail, name='book-detail'),
    
    # URL for viewing details of a specific book
    path('book/<int:book_id>/', views.book_detail, name='book-detail'),
    
    # Include all DRF router URLs under the 'api/' prefix
    path('api/', include(router.urls)),
    
    # Add this line to your existing URLs
    path('books/<int:book_id>/', views.book_detail, name='book-detail'),
    
     # Delete endpoint
    path('delete/<int:book_id>/', views.delete_book, name='delete-book'),
    
    # Update endpoint
    path('update/<int:book_id>/', views.update_book, name='update-book'),
    
    # Book detail endpoint
    path('<int:book_id>/', views.book_detail, name='book-detail'),
    
]