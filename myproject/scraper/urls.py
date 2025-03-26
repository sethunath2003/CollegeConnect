from django.urls import path
from .views import scrape_view, home_view

urlpatterns = [
    path('scrape/', scrape_view, name='scrape'),
    path('', home_view, name='home'),
]
