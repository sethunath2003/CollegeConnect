import io
import json
from django.http import HttpResponse, JsonResponse
from django.template.loader import render_to_string
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def generate_pdf_from_template(data, template_name):
    """
    Generate a PDF document from a text template (rendered via Django templates).
    Returns a BytesIO buffer containing PDF data, or an error dict.
    """
    try:
        # 1. Render the text template to a string
        template_path = f'letters/{template_name}.txt'
        filled = render_to_string(template_path, data)

        # 2. Draw lines onto a ReportLab canvas
        buffer = io.BytesIO()
        c = canvas.Canvas(buffer, pagesize=letter)
        c.setFont('Helvetica', 12)
        y = 10 * inch

        for line in filled.splitlines():
            if line.strip():
                c.drawString(1 * inch, y, line)
                y -= 0.2 * inch
            else:
                y -= 0.1 * inch

            # start new page if we overflow
            if y < inch:
                c.showPage()
                c.setFont('Helvetica', 12)
                y = 10 * inch

        c.showPage()
        c.save()

        buffer.seek(0)
        return buffer

    except Exception as e:
        print(f"PDF generation error: {e}")
        return {'error': str(e), 'status': 500}


def generate_pdf_from_template_structure(structure, data):
    """
    Generate a PDF document from a structured definition:
    'structure' is a dict with a 'sections' list, each section dict
    describes one block: title, paragraph, table, spacer, etc.
    Returns a BytesIO buffer containing PDF data, or an error dict.
    """
    # Validate structure type early — callers/tests expect a ValueError for invalid structure
    if not isinstance(structure, dict):
        raise ValueError("Invalid pdf structure: expected a dict")

    try:
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=72, leftMargin=72,
            topMargin=72, bottomMargin=72
        )
        styles = getSampleStyleSheet()
        elements = []

        # First, look under “sections”, fall back to “elements”
        sections = structure.get('sections') or structure.get('elements') or []

        for section in sections:
            t = section.get('type')

            # Helper: resolve text from several possible keys: text, template, or field
            def _resolve_text(sec):
                # 1) explicit static text
                if 'text' in sec and sec.get('text') is not None:
                    return str(sec.get('text'))
                # 2) template formatting using Python str.format
                if 'template' in sec and sec.get('template') is not None:
                    tmpl = sec.get('template')
                    # Use a safe mapping so missing keys become empty strings instead of raising
                    class SafeDict(dict):
                        def __missing__(self, key):
                            return ''
                    try:
                        return tmpl.format_map(SafeDict(data or {}))
                    except Exception:
                        # If formatting still fails for some reason, fall back to raw template
                        return str(tmpl)
                # 3) a field key pointing into `data`
                field = sec.get('field')
                if field:
                    return str(data.get(field, ''))
                return ''

            if t == 'title':
                text = _resolve_text(section)
                elements.append(Paragraph(text, styles['Title']))
                elements.append(Spacer(1, 12))

            elif t == 'heading':
                text = _resolve_text(section)
                # Heading2 may not exist in all style sheets; fall back gracefully
                style = styles.get('Heading2', styles.get('Heading1'))
                elements.append(Paragraph(text, style))
                elements.append(Spacer(1, 8))

            elif t == 'paragraph':
                text = _resolve_text(section)
                elements.append(Paragraph(text, styles['BodyText']))
                elements.append(Spacer(1, 6))

            elif t == 'spacer':
                # support either 'height' or 'size' keys
                height = section.get('height', section.get('size', 12))
                try:
                    height = float(height)
                except Exception:
                    height = 12
                elements.append(Spacer(1, height))

            elif t == 'table':
                # Expect section['columns'] and data list at section['field']
                cols = section.get('columns', []) or []
                rows = data.get(section.get('field'), []) if isinstance(data, dict) else []
                if not isinstance(rows, list):
                    rows = []
                table_data = [cols] + [[row.get(c, '') for c in cols] for row in rows]
                tbl = Table(table_data, hAlign='LEFT')
                tbl.setStyle(TableStyle([
                    ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
                    ('BACKGROUND', (0,0), (-1,0), colors.lightgrey),
                ]))
                elements.append(tbl)
                elements.append(Spacer(1, 12))

            # add other section types here…

        # THIS is the crucial step: build the PDF into the buffer
        doc.build(elements)
        buffer.seek(0)
        return buffer

    except Exception as e:
        print(f"PDF generation error: {e}")
        return {'error': str(e), 'status': 500}
