from rest_framework import serializers
from .models import LetterTemplate, LetterDraft

class LetterTemplateSerializer(serializers.ModelSerializer):
    """
    Serializer for LetterTemplate model.
    Excludes pdf_structure by default as it's backend-only.
    """
    class Meta:
        model = LetterTemplate
        fields = (
            'id',
            'name',
            'template_type',
            'description',
            'color_class',
            'form_structure',      # Needed by frontend to build the form
            'validation_schema',   # Optional: Frontend could use this for pre-validation
            # 'pdf_structure' # Excluded - Backend internal detail
            'created_at',
            'updated_at'
        )
        read_only_fields = ('created_at', 'updated_at')


class LetterDraftSerializer(serializers.ModelSerializer):
    """ Serializer for LetterDraft model. """
    # Optionally include basic template info if the ForeignKey is used
    # template = LetterTemplateSerializer(read_only=True, fields=('id', 'name', 'template_type')) # Example

    class Meta:
        model = LetterDraft
        fields = (
            'id',
            # 'template', # Include if using the nested serializer above
            'letter_type',      # The type identifier used when creating/updating
            'template_data',    # The actual user-filled data
            'user',             # Keep user associated, but make read-only on input
            'created_at',
            'updated_at',
        )
        read_only_fields = ('user', 'created_at', 'updated_at') # User is set based on request context

    def create(self, validated_data):
        # User is added from the context passed by the view
        validated_data['user'] = self.context['request'].user
        # Template link is handled in the view after validation
        return super().create(validated_data)

    def update(self, instance, validated_data):
         # User cannot be changed on update
         validated_data.pop('user', None)
         # Template link is handled in the view after validation
         return super().update(instance, validated_data)