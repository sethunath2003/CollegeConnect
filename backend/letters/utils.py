from django.http import HttpResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from django.template.loader import render_to_string
import io

def generate_pdf_from_template(data, template_name):
    try:
        # Fix the path to match your project structure
        template_path = f'letters/templates/{template_name}.txt'  # Make sure this path is correct
        filled_template = render_to_string(template_path, data)
        
        # Create PDF
        buffer = io.BytesIO()
        c = canvas.Canvas(buffer, pagesize=letter)
        c.setFont('Helvetica', 12)
        y_position = 10 * inch
        
        # Process the template line by line
        lines = filled_template.split('\n')
        for line in lines:
            if line.strip():  # Skip empty lines
                c.drawString(1 * inch, y_position, line)
                y_position -= 0.2 * inch
        
        c.showPage()
        c.save()
        
        # Prepare the response
        buffer.seek(0)
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{template_name}_letter.pdf"'
        return response
    except Exception as e:
        print(f"PDF generation error: {e}")
        return {'error': str(e), 'status': 500}
