from django.shortcuts import render, redirect, get_object_or_404
from django.db.models import Q
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from .models import Book
from .forms import BookForm
from rest_framework import viewsets, status
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import BookSerializer
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from django.utils.decorators import method_decorator
from django.http import JsonResponse
import json

@api_view(['GET'])
def index(request):
    """
    List all books, with optional search functionality.
    """
    # Get search query from GET parameters
    search_query = request.GET.get('search', '')
    
    # Query the database
    books = Book.objects.all().order_by('-id')
    
    # Filter by search query if provided
    if search_query:
        books = books.filter(
            Q(title__icontains=search_query) |
            Q(description__icontains=search_query) |
            Q(owner_name__icontains=search_query)
        )
    
    # Serialize the books and return as JSON
    serializer = BookSerializer(books, many=True)
    return Response(serializer.data)

@csrf_exempt
def post_book(request):
    """
    View function to handle posting a new book.
    
    Handles both the form display (GET) and form submission (POST).
    """
    if request.method == 'POST':
        # Process the form submission
        form = BookForm(request.POST, request.FILES)
        if form.is_valid():
            # Save the form data to create a new book
            form.save()
            # Add a success message
            messages.success(request, 'Book posted successfully!')
            # Redirect to the book listing page
            return redirect('index')
    else:
        # Display an empty form for GET requests
        form = BookForm()
    
    # Render the form template
    return render(request, 'books/post.html', {'form': form})

@csrf_exempt
def select_book(request, book_id):
    """
    View function to handle selecting (booking) a book.
    
    Gets a book by ID and processes the booking form.
    """
    # Get the book or return 404 if not found
    book = get_object_or_404(Book, id=book_id)
    
    if request.method == 'POST':
        # Update the book with booker information
        book.booker_name = request.POST.get('booker_name')
        book.booker_email = request.POST.get('booker_email')
        book.save()
        # Redirect to book listing page
        return redirect('index')
    
    # Render the booking form template
    return render(request, 'books/selectbook.html', {'book': book})

@method_decorator(csrf_exempt, name='dispatch')
class BookViewSet(viewsets.ModelViewSet):
    """ViewSet for the Book model."""
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [AllowAny]  # This is important!
    
    @action(detail=True, methods=['post'])
    def select_book(self, request, pk=None):
        """Book a specific book."""
        try:
            book = self.get_object()
            
            # Check if already booked
            if book.booker_name:
                return Response(
                    {"error": "This book is already booked"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get booking data
            booker_name = request.data.get('booker_name')
            booker_email = request.data.get('booker_email')
            
            if not booker_name or not booker_email:
                return Response(
                    {"error": "Both name and email are required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Update book with booker information
            book.booker_name = booker_name
            book.booker_email = booker_email
            book.save()
            
            return Response(BookSerializer(book).data)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@api_view(['GET'])
def booked_by_me(request):
    """
    View function to display books booked by the authenticated user.
    
    Filters books by the current user's email from the authentication system.
    """
    # Get email from authenticated user
    user = request.user
    
    if not user.is_authenticated:
        return Response(
            {"error": "Authentication required"},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    booker_email = user.email
    
    if not booker_email:
        return Response(
            {"error": "User email not found"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Query books booked by this email
    books = Book.objects.filter(booker_email=booker_email).order_by('-id')
    
    # Serialize the books and return as JSON
    serializer = BookSerializer(books, many=True)
    
    return Response({
        'count': books.count(),
        'results': serializer.data
    })

@api_view(['GET'])
def posted_by_me(request):
    """
    View function to display books posted by a specific user.
    
    Filters books by the owner_email provided in the query parameter.
    """
    user = request.user
    
    if not user.is_authenticated:
        return Response(
            {"error": "Authentication required"},
            status=status.HTTP_401_UNAUTHORIZED
        )
    owner_email = user.email
    
    if not owner_email:
        return Response(
            {"error": "User email not found"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    
    # Query books posted by this email
    books = Book.objects.filter(owner_email=owner_email).order_by('-id')
    
    # Serialize the books and return as JSON
    serializer = BookSerializer(books, many=True)
    
    return Response({
        'count': books.count(),
        'results': serializer.data
    })

class BookPostView(APIView):
    permission_classes = [AllowAny]  # Allow any user to post
    
    @csrf_exempt
    def post(self, request, **kwargs):
        # Process the book creation request
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
