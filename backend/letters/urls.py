from django.urls import path
from . import views

# URL patterns for the letters application
# These define the API endpoints for letter-related functionality
urlpatterns = [
    # Endpoint for generating a new letter based on template and data
    path('generate/', views.generate_letter, name='generate_letter'),
    
    # Endpoint for saving a letter draft to the database
    path('drafts/save/', views.save_letter_draft, name='save_letter_draft'),
    
    # Endpoint for listing all letter drafts
    path('drafts/', views.list_letter_drafts, name='list_letter_drafts'),
    
    # Endpoint for managing (get/update/delete) a specific letter draft
    path('drafts/<int:draft_id>/', views.manage_letter_draft, name='manage_letter_draft'),
]