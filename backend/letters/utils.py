from django.http import HttpResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from django.template.loader import render_to_string
import io
import os
from django.conf import settings

def generate_pdf_from_template(data, template_name):
    """
    Generate a PDF document from a template file.
    
    This function loads a text-based template, fills it with provided data,
    and renders it as a PDF document using ReportLab.
    
    Args:
        data (dict): Dictionary containing the values to insert in the template
        template_name (str): Name of the template file without extension
        
    Returns:
        HttpResponse: Response object containing the PDF file
        or dict: Error information if generation fails
    """
    try:
        # Construct the correct template path
        template_path = f'letters/{template_name}.txt'
        
        # Use Django's template engine to fill placeholders
        filled_template = render_to_string(template_path, data)
        
        # Create a BytesIO buffer to receive PDF data
        buffer = io.BytesIO()
        
        # Initialize the PDF canvas with letter size
        c = canvas.Canvas(buffer, pagesize=letter)
        c.setFont('Helvetica', 12)
        
        # Start from top of page
        y_position = 10 * inch  # Start at the top
        
        # Process the template line by line
        lines = filled_template.split('\n')
        for line in lines:
            if line.strip():  # Skip empty lines
                c.drawString(1 * inch, y_position, line)
                y_position -= 0.2 * inch  # Move down for the next line
            else:
                y_position -= 0.1 * inch  # Smaller space for empty lines
        
        # Finalize the PDF and prepare the response
        c.showPage()
        c.save()
        
        # Reset buffer position for reading
        buffer.seek(0)
        
        # Create HTTP response with PDF content
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'inline; filename="{template_name}_letter.pdf"'
        return response
    except Exception as e:
        # Log the error for debugging
        print(f"PDF generation error: {e}")
        # Return error information
        return {'error': str(e), 'status': 500}
