from django.http import HttpResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from django.template.loader import render_to_string
import io
import os
from django.conf import settings

def generate_pdf_from_template(data, template_name):
    try:
        # Correct template path format
        template_path = f'letters/{template_name}.txt'
        
        # Use Django's template engine to fill placeholders
        filled_template = render_to_string(template_path, data)
        
        # Create PDF
        buffer = io.BytesIO()
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
        
        c.showPage()
        c.save()
        
        # Prepare the response
        buffer.seek(0)
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'inline; filename="{template_name}_letter.pdf"'
        return response
    except Exception as e:
        print(f"PDF generation error: {e}")
        return {'error': str(e), 'status': 500}
