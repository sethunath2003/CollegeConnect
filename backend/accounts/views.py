import token
from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

# Helper function to generate tokens
def get_tokens_for_user(user):
    """
    Generate JWT tokens for a user.
    
    Args:
        user: User object for which to generate tokens
        
    Returns:
        dict: Dictionary containing refresh and access tokens
    """
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@api_view(['POST'])
def register_user(request):
    """
    Register a new user and save to database.
    
    Validates input data, checks for duplicate username/email,
    and creates a new user if validation passes.
    
    Expected request data:
        - username: User's username
        - email: User's email
        - password: User's password
        - password2: Password confirmation
        
    Returns:
        - Success response with user details or error message
    """
    data = request.data
    
    # Validate password match
    if data['password'] != data['password2']:
        return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if username already exists
    if User.objects.filter(username=data['username']).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if email already exists
    if User.objects.filter(email=data['email']).exists():
        return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Create new user
    user = User.objects.create_user(
        username=data['username'],
        email=data['email'],
        password=data['password']
    )
    
    # Generate tokens using the helper function
    tokens = get_tokens_for_user(user)
    
    # Return success response with user details
    return Response({
        'message': 'User created successfully',
        'user_id': user.id,
        'username': user.username,
        'email': user.email,
        'token': tokens['access']
    }, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([AllowAny]) 
def login_user(request):
    """Authenticate a user"""
    data = request.data
    
    # Get email and password from request data
    email = data.get('email', '')
    password = data.get('password', '')
    
    if not email or not password:
        return Response({'error': 'Both email and password are required'}, 
                        status=status.HTTP_400_BAD_REQUEST)
    
    # First, try to find a user with this email
    try:
        user_obj = User.objects.get(email=email)
        # Then authenticate with username and password
        user = authenticate(request, username=user_obj.username, password=password)
    except User.DoesNotExist:
        # If no user with this email, try authenticating with email as username (fallback)
        user = authenticate(request, username=email, password=password)
    
    if user is not None:
        login(request, user)
        # Generate JWT token
        tokens = get_tokens_for_user(user)
        
        return Response({
            'message': 'Login successful',
            'user_id': user.id,
            'username': user.username,
            'email': user.email,  # Make sure this is included
            'token': tokens['access']
        }, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid credentials'}, 
                        status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    """Retrieve user's profile data including academic information"""
    try:
        # Get the user profile - adjust based on your actual model structure
        user = request.user
        
        # If you have a separate Profile model
        try:
            profile = user.profile  # Assuming related_name='profile'
            data = {
                'user_id': user.id,
                'username': user.username,
                'email': user.email,
                'full_name': profile.full_name,
                'department': profile.department,
                'degree_program': profile.degree_program,
                'semester': profile.semester,
                'year': profile.year,
            }
        except AttributeError:
            # Fallback if no profile exists
            data = {
                'user_id': user.id, 
                'username': user.username,
                'email': user.email,
            }
        
        return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def submit_contact_form(request):
    """
    Handle contact form submissions from the frontend.
    """
    serializer = ContactSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Your message has been received."}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)