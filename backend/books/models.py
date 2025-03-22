from django.db import models

class Book(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField()
    location = models.CharField(max_length=150)
    cost = models.FloatField()
    owner_name = models.CharField(max_length=150, default='Unknown')  # Added default value
    booker_name = models.CharField(max_length=150, blank=True, null=True)
    booker_email = models.CharField(max_length=150, blank=True, null=True)
    cover_image = models.ImageField(upload_to='book_covers/', blank=True, null=True)

    def __str__(self):
        return self.title
