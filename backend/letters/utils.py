from django.http import HttpResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from django.template.loader import render_to_string
import io
import os
from django.conf import settings
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

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

def generate_pdf_from_template_structure(structure, data):
    """
    Generate PDF using a template structure from the database
    
    Args:
        structure: JSON structure defining the PDF layout
        data: Form data to populate the template
        
    Returns:
        BytesIO buffer containing the generated PDF
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, 
                          rightMargin=72, leftMargin=72,
                          topMargin=72, bottomMargin=72)
    
    elements = []
    styles = getSampleStyleSheet()
    
    # Create custom styles
    title_style = ParagraphStyle(
        'Title',
        parent=styles['Title'],
        fontSize=14,
        alignment=1,  # Center alignment
    )
    
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontSize=11,
        spaceAfter=12,
    )
    
    # Process each section in the template structure
    for section in structure.get('sections', []):
        section_type = section.get('type')
        
        if section_type == 'title':
            # Title element
            elements.append(Paragraph(section.get('text', ''), title_style))
            
        elif section_type == 'spacer':
            # Spacer element
            size = section.get('size', 0.2)
            elements.append(Spacer(1, size * inch))
            
        elif section_type == 'date':
            # Date element from form data
            date_field = section.get('field', 'Date')
            elements.append(Paragraph(data.get(date_field, ''), styles['Normal']))
            
        elif section_type == 'recipient':
            # Recipient section
            elements.append(Paragraph('To', styles['Normal']))
            elements.append(Paragraph(section.get('text', ''), styles['Normal']))
            if 'field' in section:
                elements.append(Paragraph(data.get(section['field'], ''), styles['Normal']))
                
        elif section_type == 'subject':
            # Subject line
            elements.append(Paragraph(f"Subject: {section.get('text', '')}", styles['Normal']))
            
        elif section_type == 'greeting':
            # Greeting line
            elements.append(Paragraph(section.get('text', 'Dear Sir/Madam,'), styles['Normal']))
            
        elif section_type == 'body':
            # Main body text - replace placeholders with actual data
            template_text = section.get('template', '')
            # Replace all placeholders in format {field_name} with actual data
            for field, value in data.items():
                template_text = template_text.replace(f"{{{field}}}", str(value))
            elements.append(Paragraph(template_text, body_style))
            
        elif section_type == 'closing':
            # Closing line
            elements.append(Paragraph(section.get('text', 'Yours sincerely,'), styles['Normal']))
            
        elif section_type == 'signature':
            # Signature line - use field from data
            field = section.get('field', 'yourName')
            elements.append(Paragraph(data.get(field, ''), styles['Normal']))
    
    # Build PDF document
    doc.build(elements)
    buffer.seek(0)
    return buffer
