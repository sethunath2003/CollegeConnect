from django.core.management.base import BaseCommand
from events.scraper import scrape_events


class Command(BaseCommand):
    help = "Scrape events and save them to the DB (wrapper around events.scraper.scrape_events)"

    def handle(self, *args, **options):
        self.stdout.write("Starting scrape_events...")
        try:
            results = scrape_events()
            # If the scraper returns a summary, print it
            if isinstance(results, dict):
                self.stdout.write(self.style.SUCCESS(f"Scrape result: {results}"))
            else:
                self.stdout.write(self.style.SUCCESS("Scrape completed."))
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Scrape failed: {e}"))
