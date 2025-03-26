from django.shortcuts import render
from .scraper import scrape_allhacks

def scrape_view(request):
    data = scrape_allhacks()
    return render(request, 'scraper/scrape.html', {'data': data})

def home_view(request):
    data = scrape_allhacks()
    return render(request, 'scraper/home.html', {'data': data})
