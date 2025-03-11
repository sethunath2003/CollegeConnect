from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .utils import generate_pdf_from_template
from django.contrib.auth.decorators import login_required
from .models import LetterDraft
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_letter_draft(request):
    try:
        letter_type = request.data.get('letter_type')
        template_data = request.data.get('template_data')
        
        if not letter_type or not template_data:
            return Response({'error': 'Missing letter type or template data'}, status=400)
        
        draft = LetterDraft.objects.create(
            user=request.user,
            letter_type=letter_type,
            template_data=template_data
        )
        
        return Response({
            'status': 'success',
            'message': 'Draft saved successfully',
            'draft_id': draft.id
        }, status=201)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
def generate_letter(request):
    try:
        template_type = request.data.get('template')
        form_data = request.data.get('data')
        
        if not template_type or not form_data:
            return Response({'error': 'Missing template type or form data'}, status=400)
        
        # Generate PDF
        pdf_buffer = generate_pdf_letter(template_type, form_data)
        
        response = HttpResponse(pdf_buffer.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = f'inline; filename="{template_type}_letter.pdf"'
        return response
    except Exception as e:
        return Response({'error': str(e)}, status=500)

# Your PDF generation function remains the same
def generate_pdf_letter(template_type, data):
    buffer = io.BytesIO()
    
    # Create the PDF object using ReportLab
    doc = SimpleDocTemplate(buffer, pagesize=letter, 
                          rightMargin=72, leftMargin=72,
                          topMargin=72, bottomMargin=72)
    
    # Add content based on template type
    elements = []
    styles = getSampleStyleSheet()
    
    # Define custom styles
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
    
    # Add common elements like date and address
    current_date = data.get('Date', '')
    elements.append(Paragraph(current_date, styles['Normal']))
    elements.append(Spacer(1, 0.2*inch))
    
    # Choose template content based on type
    if template_type == 'internship':
        # Internship request letter content
        elements.append(Paragraph('Internship Request Letter', title_style))
        elements.append(Spacer(1, 0.3*inch))
        
        # Recipient info
        elements.append(Paragraph('To', styles['Normal']))
        elements.append(Paragraph(f"The HR Manager,", styles['Normal']))
        elements.append(Paragraph(f"{data.get('companyName', '')}", styles['Normal']))
        elements.append(Spacer(1, 0.2*inch))
        
        # Letter content
        elements.append(Paragraph('Subject: Application for Internship', styles['Normal']))
        elements.append(Spacer(1, 0.2*inch))
        
        elements.append(Paragraph('Dear Sir/Madam,', body_style))
        
        letter_body = f"""I am {data.get('yourName', '')}, a student pursuing {data.get('yourDegree', '')} in {data.get('yourDepartment', '')} 
        (Semester {data.get('yourSemester', '')}). I am writing to express my interest in applying for the {data.get('Position', '')} internship 
        position at {data.get('companyName', '')}.
        
        I am available to start from {data.get('startDate', '')} to {data.get('endDate', '')} and I am eager to gain practical 
        experience in my field of study. I believe this internship would provide me with valuable industry exposure and help me develop 
        professional skills.
        
        I have attached my resume for your consideration. I would be grateful for the opportunity to discuss how I can contribute 
        to your organization.
        
        Thank you for considering my application.
        """
        
        elements.append(Paragraph(letter_body, body_style))
        
        # Closing
        elements.append(Spacer(1, 0.2*inch))
        elements.append(Paragraph('Yours sincerely,', styles['Normal']))
        elements.append(Spacer(1, 0.3*inch))
        elements.append(Paragraph(f"{data.get('yourName', '')}", styles['Normal']))
        
    elif template_type == 'dutyleave':
        # Duty leave letter content
        elements.append(Paragraph('Duty Leave Application', title_style))
        elements.append(Spacer(1, 0.3*inch))
        
        # Recipient info
        elements.append(Paragraph('To', styles['Normal']))
        elements.append(Paragraph("The Head of Department,", styles['Normal']))
        elements.append(Paragraph(f"{data.get('yourDepartment', '')}", styles['Normal']))
        elements.append(Spacer(1, 0.2*inch))
        
        # Letter content
        elements.append(Paragraph('Subject: Application for Duty Leave', styles['Normal']))
        elements.append(Spacer(1, 0.2*inch))
        
        elements.append(Paragraph('Respected Sir/Madam,', body_style))
        
        letter_body = f"""I, {data.get('yourName', '')}, a student of {data.get('yourDegree', '')} (Semester {data.get('yourSemester', '')}) 
        in {data.get('yourDepartment', '')}, would like to request duty leave on {data.get('eventDate', '')} from {data.get('startTime', '')} 
        to {data.get('endTime', '')}.
        
        I am participating in "{data.get('eventName', '')}", which is being organized by {data.get('eventHolder', '')}. This event 
        will provide me with valuable experience and knowledge in my field of study.
        
        I kindly request you to grant me leave for this period. I assure you that I will complete all missed assignments and lectures.
        
        Thank you for your consideration.
        """
        
        elements.append(Paragraph(letter_body, body_style))
        
        # Closing
        elements.append(Spacer(1, 0.2*inch))
        elements.append(Paragraph('Yours sincerely,', styles['Normal']))
        elements.append(Spacer(1, 0.3*inch))
        elements.append(Paragraph(f"{data.get('yourName', '')}", styles['Normal']))
        
    elif template_type == 'permission':
        # Permission letter content
        elements.append(Paragraph('Permission Letter', title_style))
        elements.append(Spacer(1, 0.3*inch))
        
        # Recipient info
        elements.append(Paragraph('To', styles['Normal']))
        elements.append(Paragraph("The Principal/Dean,", styles['Normal']))
        elements.append(Spacer(1, 0.2*inch))
        
        # Letter content
        elements.append(Paragraph('Subject: Request for Permission to Organize/Participate in Event', styles['Normal']))
        elements.append(Spacer(1, 0.2*inch))
        
        elements.append(Paragraph('Respected Sir/Madam,', body_style))
        
        letter_body = f"""I, {data.get('yourName', '')}, Roll No. {data.get('yourRollno', '')}, a student of {data.get('yourDegree', '')} 
        (Semester {data.get('yourSemester', '')}) in {data.get('yourDepartment', '')}, would like to request your permission 
        to organize/participate in "{data.get('eventName', '')}" on {data.get('eventDate', '')} at {data.get('eventVenue', '')}.
        
        The event details are as follows:
        {data.get('eventDescription', '')}
        
        The following students will be participating:
        {data.get('studentDetails', 'N/A')}
        
        We assure you that all college rules will be followed during the event.
        
        Thank you for your consideration.
        """
        
        elements.append(Paragraph(letter_body, body_style))
        
        # Closing
        elements.append(Spacer(1, 0.2*inch))
        elements.append(Paragraph('Yours sincerely,', styles['Normal']))
        elements.append(Spacer(1, 0.3*inch))
        elements.append(Paragraph(f"{data.get('yourName', '')}", styles['Normal']))
    
    else:
        elements.append(Paragraph('Unsupported template type', styles['Title']))
    
    # Build the PDF document
    doc.build(elements)
    buffer.seek(0)
    return buffer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_letter_drafts(request):
    drafts = LetterDraft.objects.filter(user=request.user).order_by('-updated_at')
    drafts_data = []
    
    for draft in drafts:
        drafts_data.append({
            'id': draft.id,
            'letter_type': draft.letter_type,
            'template_data': draft.template_data,
            'created_at': draft.created_at.isoformat(),
            'updated_at': draft.updated_at.isoformat()
        })
    
    return Response({'drafts': drafts_data})


