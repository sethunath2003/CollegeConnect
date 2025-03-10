from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .utils import generate_pdf_from_template
from django.contrib.auth.decorators import login_required
from .models import LetterDraft
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

@csrf_exempt
def generate_letter_pdf(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            template_name = data.get('template')
            form_data = data.get('data')
            
            if not template_name or not form_data:
                return JsonResponse({'error': 'Missing template or form data'}, status=400)
            
            response = generate_pdf_from_template(form_data, template_name)
            
            if isinstance(response, dict) and 'error' in response:
                return JsonResponse(response, status=response.get('status', 500))
            return response
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Only POST method is allowed'}, status=405)

@csrf_exempt
@login_required
def save_letter_draft(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            letter_type = data.get('letter_type')
            template_data = data.get('template_data')
            
            if not letter_type or not template_data:
                return JsonResponse({'error': 'Missing letter type or template data'}, status=400)
            
            draft = LetterDraft.objects.create(
                user=request.user,
                letter_type=letter_type,
                template_data=template_data
            )
            
            return JsonResponse({
                'status': 'success',
                'message': 'Draft saved successfully',
                'draft_id': draft.id
            }, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@login_required
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
    
    return JsonResponse({'drafts': drafts_data})


