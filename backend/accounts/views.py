from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view
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
    
    # Return success response with user details
    return Response({
        'message': 'User created successfully',
        'user_id': user.id,
        'username': user.username
    }, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def login_user(request):
    """Authenticate a user"""
    data = request.data
    
    # For your login form, you are using 'email' field but Django's authenticate
    # uses 'username' by default, so we need to handle both cases
    username = data.get('username', data.get('email', ''))
    password = data.get('password', '')
    
    # Try to authenticate with username
    user = authenticate(request, username=username, password=password)
    
    # If that didn't work, try with email
    if user is None and '@' in username:
        try:
            user_obj = User.objects.get(email=username)
            user = authenticate(request, username=user_obj.username, password=password)
        except User.DoesNotExist:
            pass
    
    if user is not None:
        login(request, user)
        # Generate JWT token
        tokens = get_tokens_for_user(user)
        
        return Response({
            'message': 'Login successful',
            'user_id': user.id,
            'username': user.username,
            'token': tokens['access']  # Return the access token
        }, status=status.HTTP_200_OK)
    
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
