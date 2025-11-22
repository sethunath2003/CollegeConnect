from django.http import JsonResponse, HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes, renderer_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.renderers import JSONRenderer
from .renderers import PDFRenderer
import logging
import json
from .utils import generate_pdf_from_template, generate_pdf_from_template_structure
from django.contrib.auth.decorators import login_required
from .models import LetterDraft, LetterTemplate
from .serializers import LetterTemplateSerializer, LetterDraftSerializer
import io
from django.conf import settings
from django.templatetags.static import static
import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

logger = logging.getLogger(__name__)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_templates(request):
    """
    API endpoint to get all available letter templates.
    Returns structure needed for the frontend form rendering.
    """
    try:
        templates = LetterTemplate.objects.all().order_by('name')
        serializer = LetterTemplateSerializer(templates, many=True)
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error fetching templates: {e}", exc_info=True)
        return Response({'error': 'Could not retrieve templates.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_letter(request):
    """
    API endpoint to generate a PDF letter based on a template_type and form_data.
    Uses the backend LetterTemplate definition (pdf_structure).
    """
    template_type = request.data.get('template_type')
    form_data = request.data.get('data')

    if not template_type or not form_data:
        return Response({'error': 'Missing template_type or data'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        template = LetterTemplate.objects.get(template_type=template_type)
        is_valid, error_message = template.validate_data(form_data)
        if not is_valid:
            logger.warning(f"Validation failed for template '{template_type}': {error_message}")
            return Response({'error': f'Invalid form data: {error_message}'}, status=status.HTTP_400_BAD_REQUEST)

        pdf_buffer = generate_pdf_from_template_structure(template.pdf_structure, form_data)
        response = HttpResponse(pdf_buffer.getvalue(), content_type='application/pdf')
        safe_filename = "".join(c if c.isalnum() else "_" for c in template.name)
        response['Content-Disposition'] = f'inline; filename="{safe_filename}_letter.pdf"'
        return response

    except LetterTemplate.DoesNotExist:
        logger.warning(f"Attempt to generate letter with non-existent template type: {template_type}")
        return Response({'error': f'Template "{template_type}" not found.'}, status=status.HTTP_404_NOT_FOUND)
    except ValueError as ve:
        logger.error(f"PDF generation failed for template '{template_type}': {ve}", exc_info=True)
        return Response({'error': f'PDF generation failed: {ve}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        logger.error(f"Unexpected error generating letter for template '{template_type}': {e}", exc_info=True)
        return Response({'error': 'An unexpected error occurred during PDF generation.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_letter_draft(request):
    """ Saves a new letter draft for the authenticated user. """
    serializer = LetterDraftSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        try:
            template_type = serializer.validated_data.get('letter_type')
            template = LetterTemplate.objects.filter(template_type=template_type).first()
            draft = serializer.save(user=request.user, template=template)
            return Response(LetterDraftSerializer(draft).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error saving draft for user {request.user.id}: {e}", exc_info=True)
            return Response({'error': 'Failed to save draft.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_letter_drafts(request):
    """ List all letter drafts for the authenticated user. """
    try:
        drafts = LetterDraft.objects.filter(user=request.user).order_by('-updated_at')
        serializer = LetterDraftSerializer(drafts, many=True)
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error listing drafts for user {request.user.id}: {e}", exc_info=True)
        return Response({'error': 'Could not retrieve drafts.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def manage_letter_draft(request, draft_id):
    """ Get, update or delete a specific letter draft owned by the authenticated user. """
    try:
        draft = get_object_or_404(LetterDraft, id=draft_id)
        if draft.user != request.user:
            logger.warning(f"User {request.user.id} attempt to access draft {draft_id} owned by user {draft.user.id}")
            return Response({'error': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)

        if request.method == 'GET':
            serializer = LetterDraftSerializer(draft)
            return Response(serializer.data)

        elif request.method == 'PUT':
            serializer = LetterDraftSerializer(draft, data=request.data, partial=True, context={'request': request})
            if serializer.is_valid():
                template_type = serializer.validated_data.get('letter_type', draft.letter_type)
                template = LetterTemplate.objects.filter(template_type=template_type).first()
                serializer.save(template=template)
                return Response(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif request.method == 'DELETE':
            draft.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

    except LetterDraft.DoesNotExist:
        return Response({'error': 'Draft not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error managing draft {draft_id} for user {request.user.id}: {e}", exc_info=True)
        return Response({'error': 'An error occurred managing the draft.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
@renderer_classes([PDFRenderer, JSONRenderer])
def generate_pdf(request):
    """Generate a PDF and return it. Uses PDFRenderer so DRF can satisfy Accept: application/pdf."""
    # Use DRF-parsed data (supports JSON body and form data)
    template_type = request.data.get('template_type')
    form_data = request.data.get('data', {})

    if not template_type or not form_data:
        return Response({'error': 'Missing template_type or form data.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        template = LetterTemplate.objects.get(template_type=template_type)
    except LetterTemplate.DoesNotExist:
        return Response({'error': f'Template "{template_type}" not found.'}, status=status.HTTP_404_NOT_FOUND)

    pdf_buffer = generate_pdf_from_template_structure(template.pdf_structure, form_data)
    if isinstance(pdf_buffer, dict):
        # util returns an error dict
        return Response(pdf_buffer, status=pdf_buffer.get('status', 500))

    # Return raw bytes — PDFRenderer will handle streaming
    try:
        pdf_buffer.seek(0)
    except Exception:
        pass

    return Response(pdf_buffer, content_type='application/pdf')


