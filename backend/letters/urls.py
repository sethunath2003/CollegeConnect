from django.urls import path
from . import views

urlpatterns = [
    path('templates/', views.get_templates, name='get_templates'),
    # route 'generate/' to the DRF-backed PDF endpoint which supports application/pdf
    path('generate/', views.generate_pdf, name='generate_pdf'),
    path('drafts/', views.list_letter_drafts, name='list_letter_drafts'),
    path('drafts/save/', views.save_letter_draft, name='save_letter_draft'),
    path('drafts/<int:draft_id>/', views.manage_letter_draft, name='manage_letter_draft'),
]