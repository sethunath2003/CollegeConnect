from django.urls import path
from . import views

urlpatterns = [
    path('generate/', views.generate_letter_pdf, name='generate_letter_pdf'),
    path('drafts/save/', views.save_letter_draft, name='save_letter_draft'),
    path('drafts/', views.get_letter_drafts, name='get_letter_drafts'),
]