from django.contrib import admin
from .models import LetterDraft, LetterTemplate

@admin.register(LetterTemplate)
class LetterTemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'template_type', 'created_at', 'updated_at')
    search_fields = ('name', 'template_type', 'description')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(LetterDraft)
class LetterDraftAdmin(admin.ModelAdmin):
    list_display = ('letter_type', 'user', 'created_at', 'updated_at')
    list_filter = ('letter_type', 'created_at')
    search_fields = ('user__username', 'letter_type')
    readonly_fields = ('created_at', 'updated_at')
