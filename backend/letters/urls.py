from django.urls import path
from . import views

urlpatterns = [
    path('generate/', views.generate_letter, name='generate_letter'),
    path('drafts/save/', views.save_letter_draft, name='save_letter_draft'),
    path('drafts/', views.get_letter_drafts, name='get_user_drafts'),  # Optional: endpoint to retrieve drafts
]