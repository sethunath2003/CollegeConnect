# letters/models.py
from django.db import models
from django.contrib.auth.models import User
import jsonschema
from jsonschema import validate

class LetterTemplate(models.Model):
    """
    Model to store letter templates with their structure and validation rules.
    The backend defines both the form UI and the PDF output structure.
    """
    name = models.CharField(max_length=100)
    template_type = models.CharField(max_length=50, unique=True, db_index=True) # Increased length, added index
    description = models.TextField(blank=True) # Allow blank description
    color_class = models.CharField(max_length=30, default="blue") # Single correct definition

    # Structure for the React form generator
    form_structure = models.JSONField(
        help_text="Defines fields, types, labels, etc., for the frontend form.",
        default=dict # Default to an empty dict
    )

    # Structure for the ReportLab PDF generator
    pdf_structure = models.JSONField(
        help_text="Defines paragraphs, spacers, data insertion for PDF generation.",
        default=dict # Default to an empty dict
    )

    # JSON Schema for validating the data submitted via the form
    validation_schema = models.JSONField(
        null=True, blank=True,
        help_text="JSON Schema to validate the form_data against."
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def validate_data(self, data):
        """
        Validates submitted data against the template's validation_schema.

        Args:
            data (dict): The data submitted from the frontend form.

        Returns:
            tuple: (bool, str or None) - (is_valid, error_message)
        """
        if not self.validation_schema:
            return True, None  # No schema defined, assume data is valid

        try:
            validate(instance=data, schema=self.validation_schema)
            return True, None
        except jsonschema.exceptions.ValidationError as e:
            # Try to provide a user-friendly path and message
            field_path = " -> ".join(map(str, e.path))
            error_message = f"Validation Error for field '{field_path}': {e.message}" if e.path else f"Validation Error: {e.message}"
            # Log the detailed error for server-side debugging
            # logger.warning(f"JSON Schema validation failed for template '{self.template_type}': {e}")
            return False, error_message
        except Exception as e:
            # Catch other potential errors during validation
            # logger.error(f"Unexpected error during validation for template '{self.template_type}': {e}")
            return False, f"An unexpected validation error occurred: {str(e)}"

    def __str__(self):
        return f"{self.name} ({self.template_type})"


class LetterDraft(models.Model):
    """
    Model to store letter drafts created by users.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='letter_drafts')
    # Optional but Recommended: Link directly to the template used
    template = models.ForeignKey(LetterTemplate, on_delete=models.SET_NULL, null=True, blank=True, related_name='drafts')
    letter_type = models.CharField(max_length=50) # Store the type used at creation, matches template.template_type
    template_data = models.JSONField() # The actual data filled by the user
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        """String representation of the LetterDraft object"""
        template_name = self.template.name if self.template else self.letter_type
        return f"{template_name} draft by {self.user.username}"