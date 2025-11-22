from django.test import SimpleTestCase
from ..utils import generate_pdf_from_template_structure
import io


class PDFGenerationTest(SimpleTestCase):
    def test_generate_pdf_from_template_structure_basic(self):
        """Basic smoke test: generated buffer should start with PDF header"""
        structure = {
            "sections": [
                {"type": "title", "field": "title"},
                {"type": "paragraph", "field": "body"},
            ]
        }
        data = {"title": "Test Title", "body": "This is a test paragraph."}

        result = generate_pdf_from_template_structure(structure, data)

        # util returns dict on error
        if isinstance(result, dict):
            self.fail(f"PDF util returned error: {result}")

        # result should be a file-like buffer
        self.assertTrue(hasattr(result, "read"))
        result.seek(0)
        header = result.read(4)
        self.assertEqual(header, b"%PDF")
