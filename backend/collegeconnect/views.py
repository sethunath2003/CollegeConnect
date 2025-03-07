# Import JsonResponse to send HTTP responses in JSON format.
from django.http import JsonResponse

# Import render to render HTML templates (not used in current API implementation)
# and redirect to send a redirect response (also not used in the JSON API response).
from django.shortcuts import render, redirect

# Import csrf_exempt to disable CSRF protection for this view
# (this is used for simplicity in API endpoints; consider proper CSRF handling in production).
from django.views.decorators.csrf import csrf_exempt

# Import authenticate to verify user credentials,
# and login to create a user session after successful authentication.
from django.contrib.auth import authenticate, login

# Import the built-in User model to create and manage user accounts.
from django.contrib.auth.models import User

# Use @csrf_exempt to disable CSRF protection for the signup view.
@csrf_exempt
def signup(request):
    # Check if the incoming request uses the POST method.
    if request.method == 'POST':
        # Retrieve the 'username' field value from the POST data sent by the React signup component.
        username = request.POST.get('username')
        # Retrieve the 'password' field value from the POST data.
        password = request.POST.get('password')
        # Optionally, you can retrieve additional fields such as email here.
        
        try:
            # Create a new user with the provided username and password.
            # Django's create_user method handles password hashing automatically.
            user = User.objects.create_user(username=username, password=password)
            # Save the new user instance to the database.
            user.save()
            # Return a JSON response indicating that the signup was successful,
            # using the HTTP status code 201 (Created).
            return JsonResponse({"message": "Signup successful."}, status=201)
        except Exception as e:
            # If an error occurs during user creation (e.g., duplicate username),
            # catch the exception and return a JSON error response with status 400 (Bad Request).
            return JsonResponse({"error": str(e)}, status=400)
    
    # If the request method is not POST, return a JSON error response with status 405 (Method Not Allowed).
    return JsonResponse({"error": "Only POST method allowed."}, status=405)

# Use @csrf_exempt to disable CSRF protection for the login view.
@csrf_exempt
def user_login(request):
    # Check if the incoming request uses the POST method.
    if request.method == 'POST':
        # Retrieve the 'username' field value from the POST data sent by the React login component.
        username = request.POST.get('username')
        # Retrieve the 'password' field value from the POST data.
        password = request.POST.get('password')
        # Authenticate the user using the provided username and password.
        # If the credentials are valid, 'authenticate' returns the User object; otherwise, it returns None.
        user = authenticate(request, username=username, password=password)
        
        # Check if the user is successfully authenticated (i.e., user is not None).
        if user is not None:
            # Log the user in by creating a session for the authenticated user.
            login(request, user)
            # Return a JSON response indicating that login was successful with HTTP status 200 (OK).
            return JsonResponse({"message": "Login successful!"}, status=200)
        else:
            # If authentication fails, return a JSON response with an error message and status 401 (Unauthorized).
            return JsonResponse({"error": "Invalid credentials"}, status=401)
    
    # If the request method is not POST, return a JSON error response with status 405 (Method Not Allowed).
    return JsonResponse({"error": "Only POST method allowed."}, status=405)
    