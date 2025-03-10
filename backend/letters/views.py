from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .utils import generate_pdf as utils_generate_pdf  # Rename the import to avoid collision

@csrf_exempt
def generate_letter_pdf(request):  # Renamed the function
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            template_name = data.get('template')
            form_data = data.get('data')
            
            response = utils_generate_pdf(form_data, template_name)  # Use the renamed import
            
            if response:
                if isinstance(response, dict) and 'error' in response:
                    return JsonResponse({'error': response['error']}, status=response['status'])
                return response  # Return the PDF response directly
            else:
                return JsonResponse({'error': 'PDF generation failed'}, status=500)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)


