from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
import json
from io import BytesIO

from .models import LetterTemplate, LetterDraft
from .utils import generate_pdf_from_template_structure


class LetterTemplateModelTests(TestCase):
    """Tests for the LetterTemplate model."""
    
    def setUp(self):
        """Create test templates."""
        self.test_template = LetterTemplate.objects.create(
            name="Test Template",
            template_type="test_type",
            description="Template for testing",
            color_class="blue",
            form_structure={
                "fields": [
                    {"name": "student_name", "type": "text", "required": True},
                    {"name": "student_id", "type": "text", "required": True}
                ]
            },
            pdf_structure={
                "elements": [
                    {"type": "paragraph", "text": "This is a test document"}
                ]
            },
            validation_schema={
                "type": "object",
                "required": ["student_name", "student_id"],
                "properties": {
                    "student_name": {"type": "string", "minLength": 3},
                    "student_id": {"type": "string", "pattern": "^[A-Z0-9]+$"}
                }
            }
        )
    
    def test_template_creation(self):
        """Test that a template can be created with proper attributes."""
        self.assertEqual(self.test_template.name, "Test Template")
        self.assertEqual(self.test_template.template_type, "test_type")
        self.assertTrue(isinstance(self.test_template.form_structure, dict))
        self.assertTrue(isinstance(self.test_template.pdf_structure, dict))
    
    def test_validation_success(self):
        """Test that valid data passes validation."""
        valid_data = {
            "student_name": "John Doe",
            "student_id": "A12345"
        }
        is_valid, error = self.test_template.validate_data(valid_data)
        self.assertTrue(is_valid)
        self.assertIsNone(error)
    
    def test_validation_failure_required_field(self):
        """Test validation fails when required field is missing."""
        invalid_data = {
            "student_name": "John Doe"
            # Missing student_id
        }
        is_valid, error = self.test_template.validate_data(invalid_data)
        self.assertFalse(is_valid)
        self.assertIn("required", error.lower())
        self.assertIn("student_id", error.lower())
    
    def test_validation_failure_pattern(self):
        """Test validation fails for pattern mismatch."""
        invalid_data = {
            "student_name": "John Doe",
            "student_id": "invalid-id" # Contains hyphen, violating pattern
        }
        is_valid, error = self.test_template.validate_data(invalid_data)
        self.assertFalse(is_valid)
        self.assertIn("pattern", error.lower())
    
    def test_validation_failure_length(self):
        """Test validation fails for length constraint."""
        invalid_data = {
            "student_name": "Jo", # Too short
            "student_id": "A12345"
        }
        is_valid, error = self.test_template.validate_data(invalid_data)
        self.assertFalse(is_valid)
        self.assertIn("short", error.lower())
    
    def test_no_validation_schema(self):
        """Test behavior when no validation schema is defined."""
        template_without_schema = LetterTemplate.objects.create(
            name="No Schema Template",
            template_type="no_schema",
            form_structure={"fields": []},
            pdf_structure={"elements": []}
        )
        random_data = {"anything": "should pass"}
        is_valid, error = template_without_schema.validate_data(random_data)
        self.assertTrue(is_valid)
        self.assertIsNone(error)


class LetterDraftModelTests(TestCase):
    """Tests for the LetterDraft model."""
    
    def setUp(self):
        """Create test user, template and draft."""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword'
        )
        
        self.template = LetterTemplate.objects.create(
            name="Test Template",
            template_type="test_type",
            form_structure={"fields": []},
            pdf_structure={"elements": []}
        )
        
        self.draft = LetterDraft.objects.create(
            user=self.user,
            template=self.template,
            letter_type="test_type",
            template_data={"field1": "value1"}
        )
    
    def test_draft_creation(self):
        """Test that a draft can be created with proper attributes."""
        self.assertEqual(self.draft.user, self.user)
        self.assertEqual(self.draft.template, self.template)
        self.assertEqual(self.draft.letter_type, "test_type")
        self.assertEqual(self.draft.template_data, {"field1": "value1"})
    
    def test_string_representation(self):
        """Test the string representation of a draft."""
        expected_string = f"Test Template draft by testuser"
        self.assertEqual(str(self.draft), expected_string)


class LetterUtilsTests(TestCase):
    """Tests for the letter generation utilities."""
    
    def test_generate_pdf_from_structure(self):
        """Test PDF generation from template structure."""
        # Basic test structure
        pdf_structure = {
            "elements": [
                {"type": "paragraph", "text": "Static text test"},
                {"type": "paragraph", "field": "name"},
                {"type": "spacer", "size": 0.1}
            ]
        }
        form_data = {"name": "John Doe"}
        
        # Generate PDF
        buffer = generate_pdf_from_template_structure(pdf_structure, form_data)
        
        # Basic check - did we get a buffer with content?
        self.assertIsInstance(buffer, BytesIO)
        self.assertTrue(buffer.getvalue())
        
        # Check PDF content more thoroughly if needed
        # This would require a PDF parsing library like PyPDF2 or pdfminer.six
    
    def test_generate_pdf_with_missing_data(self):
        """Test PDF generation with missing field data."""
        pdf_structure = {
            "elements": [
                {"type": "paragraph", "field": "missing_field"},
            ]
        }
        form_data = {"some_other_field": "value"}
        
        # Should not raise an exception, missing field should be an empty string
        buffer = generate_pdf_from_template_structure(pdf_structure, form_data)
        self.assertIsInstance(buffer, BytesIO)
    
    def test_generate_pdf_with_template_syntax(self):
        """Test PDF generation with template syntax for text formatting."""
        pdf_structure = {
            "elements": [
                {"type": "paragraph", "template": "Hello {name}, your ID is {id}"},
            ]
        }
        form_data = {"name": "John", "id": "12345"}
        
        # Should format the text correctly
        buffer = generate_pdf_from_template_structure(pdf_structure, form_data)
        self.assertIsInstance(buffer, BytesIO)
    
    def test_generate_pdf_with_invalid_structure(self):
        """Test that invalid structure raises appropriate error."""
        # Completely invalid structure
        pdf_structure = "not a dictionary"
        form_data = {}
        
        with self.assertRaises(ValueError):
            generate_pdf_from_template_structure(pdf_structure, form_data)


class LetterAPITests(APITestCase):
    """Tests for the letter API endpoints."""
    
    def setUp(self):
        """Create test user and template."""
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword'
        )
        
        self.template = LetterTemplate.objects.create(
            name="Test Template",
            template_type="test_type",
            description="Template for testing",
            color_class="blue",
            form_structure={
                "fields": [
                    {"name": "student_name", "type": "text", "required": True}
                ]
            },
            pdf_structure={
                "elements": [
                    {"type": "paragraph", "text": "This is a test document"}
                ]
            }
        )
        
        # Create another user for permission tests
        self.other_user = User.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='otherpassword'
        )
        
        # Create a draft for the main test user
        self.draft = LetterDraft.objects.create(
            user=self.user,
            template=self.template,
            letter_type="test_type",
            template_data={"student_name": "John Doe"}
        )
        
        # Create a draft for the other user
        self.other_user_draft = LetterDraft.objects.create(
            user=self.other_user,
            template=self.template,
            letter_type="test_type",
            template_data={"student_name": "Jane Smith"}
        )
    
    def test_get_templates_authenticated(self):
        """Test that authenticated users can access templates."""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(reverse('get_templates'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Test Template')
    
    def test_get_templates_unauthenticated(self):
        """Test that unauthenticated users can access templates."""
        response = self.client.get(reverse('get_templates'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_generate_letter_authenticated(self):
        """Test that authenticated users can generate letters."""
        self.client.force_authenticate(user=self.user)
        data = {
            'template_type': 'test_type',
            'data': {'student_name': 'John Doe'}
        }
        response = self.client.post(reverse('generate_letter'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'application/pdf')
    
    def test_generate_letter_unauthenticated(self):
        """Test that unauthenticated users cannot generate letters."""
        data = {
            'template_type': 'test_type',
            'data': {'student_name': 'John Doe'}
        }
        response = self.client.post(reverse('generate_letter'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_generate_letter_invalid_template(self):
        """Test error handling for non-existent template."""
        self.client.force_authenticate(user=self.user)
        data = {
            'template_type': 'nonexistent_type',
            'data': {'student_name': 'John Doe'}
        }
        response = self.client.post(reverse('generate_letter'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_generate_letter_missing_data(self):
        """Test error handling for missing data."""
        self.client.force_authenticate(user=self.user)
        data = {
            'template_type': 'test_type',
            # Missing data field
        }
        response = self.client.post(reverse('generate_letter'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_list_drafts(self):
        """Test that users can list their own drafts."""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(reverse('list_letter_drafts'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Should only see their own drafts
    
    def test_get_draft_detail(self):
        """Test that users can view their own draft details."""
        self.client.force_authenticate(user=self.user)
        url = reverse('manage_letter_draft', kwargs={'draft_id': self.draft.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['letter_type'], 'test_type')
    
    def test_unauthorized_draft_access(self):
        """Test that users cannot access other users' drafts."""
        self.client.force_authenticate(user=self.user)
        url = reverse('manage_letter_draft', kwargs={'draft_id': self.other_user_draft.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_create_draft(self):
        """Test creation of a new draft."""
        self.client.force_authenticate(user=self.user)
        data = {
            'letter_type': 'test_type',
            'template_data': {'student_name': 'New Draft'}
        }
        response = self.client.post(reverse('save_letter_draft'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['template_data'], {'student_name': 'New Draft'})
    
    def test_update_draft(self):
        """Test updating an existing draft."""
        self.client.force_authenticate(user=self.user)
        url = reverse('manage_letter_draft', kwargs={'draft_id': self.draft.id})
        data = {
            'template_data': {'student_name': 'Updated Name'}
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['template_data'], {'student_name': 'Updated Name'})
    
    def test_delete_draft(self):
        """Test deleting a draft."""
        self.client.force_authenticate(user=self.user)
        url = reverse('manage_letter_draft', kwargs={'draft_id': self.draft.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Verify it's actually deleted
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
