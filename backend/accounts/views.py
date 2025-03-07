from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

# Create your views here.

@api_view(['POST'])
def register_user(request):
    """Register a new user and save to database"""
    data = request.data
    
    # Validate data
    if data['password'] != data['password2']:
        return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if username exists
    if User.objects.filter(username=data['username']).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if email exists
    if User.objects.filter(email=data['email']).exists():
        return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Create user
    user = User.objects.create_user(
        username=data['username'],
        email=data['email'],
        password=data['password']
    )
    
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
        return Response({
            'message': 'Login successful',
            'user_id': user.id,
            'username': user.username
        }, status=status.HTTP_200_OK)
    
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
