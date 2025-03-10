from django.http import HttpResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from django.template.loader import render_to_string
import io

def generate_pdf_from_template(data, template_name):
    try:
        template_path= f'letters/{template_name}.txt'
        filled_template=render_to_string(template_path,data)
        buffer=io.BytesIO()
        c=canvas.Canvas(buffer,pagesize=letter)
        c.setFont('Helvetica',12)
        y_position=10 * inch
        lines=filled_template.split('\n')
        for line in lines:
            c.drawString(1*inch,y_position,line)
            y_position-=0.2*inch
        c.showPage()
        c.save()

        buffer.seek(0)
        response=HttpResponse(buffer,content_type='application/pdf')
        response['Content-Disposition']=f'attachment; filename="{template_name}_letter.pdf"'
        return response
    except FileNotFoundError:
        return {'error':'Template not found','status':404}
    except Exception as e:
        return{'error':f'An error occurred: {e}','status':500}        
