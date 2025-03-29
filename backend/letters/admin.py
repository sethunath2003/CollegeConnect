from django.contrib import admin
from .models import LetterDraft

# Register your models to make them accessible in the Django admin interface
# This allows administrators to view, create, update, and delete records

# Example admin registration with customization:
# @admin.register(LetterDraft)
# class LetterDraftAdmin(admin.ModelAdmin):
#     list_display = ('letter_type', 'user', 'created_at', 'updated_at')
#     list_filter = ('letter_type', 'created_at')
#     search_fields = ('user__username', 'letter_type')
#     readonly_fields = ('created_at', 'updated_at')
