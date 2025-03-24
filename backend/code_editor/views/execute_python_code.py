import json
from django.http import JsonResponse, HttpResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

@method_decorator(csrf_exempt, name='dispatch')
class ExecutePythonCodeView(View):
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON.'}, status=400)

        code = data.get('code', '')
        if not code:
            return JsonResponse({'error': 'No code provided.'}, status=400)
        
        import sys, io
        old_stdout = sys.stdout
        sys.stdout = io.StringIO()
        try:
            #TODO: isnt safe !!!!
            safe_globals = {"__builtins__": __builtins__}
            safe_locals = {}
            exec(code, safe_globals, safe_locals)
            output = sys.stdout.getvalue()
        except Exception as e:
            output = f"Error: {e}"
        finally:
            sys.stdout = old_stdout
        return JsonResponse({'code': output})
    
    def get(self, request, *args, **kwargs):
        return HttpResponse("Only POST requests are allowed.", status=405)
