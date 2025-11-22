from celery import shared_task
from .scraper import scrape_events


@shared_task(bind=True)
def scrape_events_task(self):
    """Celery task wrapper around the scraper. Returns a small summary dict or raises on failure."""
    try:
        result = scrape_events()
        # If scraper returns number of created items, return that; else return a generic summary
        if isinstance(result, dict):
            return result
        return {"status": "ok"}
    except Exception as e:
        # Let Celery handle retries if configured
        raise
