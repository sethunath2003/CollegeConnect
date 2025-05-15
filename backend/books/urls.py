# This file defines URL patterns for the books application
from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from .views import BookViewSet

# Set up the DRF router for automatic URL routing
router = DefaultRouter()
router.register(r'books', BookViewSet, basename='book')

# Define URL patterns for the books application
urlpatterns = [
    # Book listing and search
    path('', views.index, name='book-list'),
    
    # Book CRUD operations
    path('post/', views.BookPostView.as_view(), name='book-post'),
    path('book/<int:book_id>/', views.book_detail, name='book-detail'),
    path('update/<int:book_id>/', views.update_book, name='update-book'),
    path('delete/<int:book_id>/', views.delete_book, name='delete-book'),
    
    # Book booking operations
    path('book/<int:book_id>/select/', views.select_book, name='select-book'),
    
    # User-specific book listings
    path('my/posted/', views.posted_by_me, name='posted-by-me'),
    path('my/booked/', views.booked_by_me, name='booked-by-me'),
    
    # Include all DRF router URLs
    path('api/', include(router.urls)),
]
