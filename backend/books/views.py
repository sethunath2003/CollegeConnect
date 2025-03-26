from django.shortcuts import render, redirect, get_object_or_404
from django.db.models import Q  # For complex queries
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from .models import Book
from .forms import BookForm
from rest_framework import viewsets, status
from .serializers import BookSerializer
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from django.utils.decorators import method_decorator

@api_view(['GET'])
def index(request):
    """
    List all books, with optional search functionality.
    This endpoint allows filtering books by title, description, or owner name.
    """
    # Get search query from GET parameters (e.g., ?search=python)
    search_query = request.GET.get('search', '')
    
    # Query the database for all books, ordered by newest first
    books = Book.objects.all().order_by('-id')
    
    # If search query is provided, filter books that match the query
    if search_query:
        books = books.filter(
            # Use Q objects to perform OR operations in the query
            Q(title__icontains=search_query) |  # Search in title
            Q(description__icontains=search_query) |  # Search in description
            Q(owner_name__icontains=search_query)  # Search in owner name
        )
    
    # Convert books queryset to JSON using the serializer
    serializer = BookSerializer(books, many=True)
    return Response(serializer.data)

@csrf_exempt
def post_book(request):
    """
    View function to handle posting a new book.
    Supports both GET (display form) and POST (submit form) requests.
    """
    if request.method == 'POST':
        # Process the form submission with submitted data and files
        form = BookForm(request.POST, request.FILES)
        if form.is_valid():
            # Save the validated form data to create a new book
            form.save()
            # Add a success message for the user
            messages.success(request, 'Book posted successfully!')
            # Redirect to the book listing page
            return redirect('index')
    else:
        # Display an empty form for GET requests
        form = BookForm()
    
    # Render the form template with the form context
    return render(request, 'books/post.html', {'form': form})

@csrf_exempt
def select_book(request, book_id):
    """
    View function to handle selecting (booking) a book.
    Gets a book by ID and updates it with booker information.
    """
    # Get the book or return 404 if not found
    book = get_object_or_404(Book, id=book_id)
    
    if request.method == 'POST':
        # Update the book with booker information from POST data
        book.booker_name = request.POST.get('booker_name')
        book.booker_email = request.POST.get('booker_email')
        book.save()
        
        # Return a JSON response with success message and updated book data
        from django.http import JsonResponse
        return JsonResponse({
            'status': 'success', 
            'message': 'Book booked successfully',
            'book': BookSerializer(book).data
        })
    
    # For GET requests, render the booking form template
    return render(request, 'books/selectbook.html', {'book': book})

@method_decorator(csrf_exempt, name='dispatch')
class BookViewSet(viewsets.ModelViewSet):
    """
    ViewSet for the Book model.
    Provides CRUD operations through REST API endpoints.
    """
    queryset = Book.objects.all()  # Get all books from the database
    serializer_class = BookSerializer  # Use BookSerializer for conversion
    permission_classes = [AllowAny]  # Allow access to all users
    
    @action(detail=True, methods=['post'])
    def select_book(self, request, pk=None):
        """
        Custom action to book a specific book.
        Detail=True means this action is available at /books/{id}/select_book/
        """
        try:
            # Get the book object by primary key (pk)
            book = self.get_object()
            
            # Check if the book is already booked
            if book.booker_name:
                return Response(
                    {"error": "This book is already booked"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get booking data from the request
            booker_name = request.data.get('booker_name')
            booker_email = request.data.get('booker_email')
            
            # Validate that both name and email are provided
            if not booker_name or not booker_email:
                return Response(
                    {"error": "Both name and email are required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Update book with booker information
            book.booker_name = booker_name
            book.booker_email = booker_email
            book.save()
            
            # Return the updated book data
            return Response(BookSerializer(book).data)
        except Exception as e:
            # Handle any unexpected errors
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@api_view(['GET'])
def booked_by_me(request):
    """
    View function to display books booked by the authenticated user.
    Filters books by the current user's email.
    """
    # Get the authenticated user from the request
    user = request.user
    
    # Check if user is authenticated
    if not user.is_authenticated:
        return Response(
            {"error": "Authentication required"},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    # Get user's email
    booker_email = user.email
    
    # Check if email exists
    if not booker_email:
        return Response(
            {"error": "User email not found"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Query books booked by this email, newest first
    books = Book.objects.filter(booker_email=booker_email).order_by('-id')
    
    # Serialize the books and return as JSON
    serializer = BookSerializer(books, many=True)
    
    # Return count and results
    return Response({
        'count': books.count(),
        'results': serializer.data
    })

@api_view(['GET'])
def posted_by_me(request):
    """
    View function to display books posted by the authenticated user.
    Filters books by the owner_email.
    """
    # Get the authenticated user
    user = request.user
    
    # Check if user is authenticated
    if not user.is_authenticated:
        return Response(
            {"error": "Authentication required"},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    # Get user's email
    owner_email = user.email
    
    # Check if email exists
    if not owner_email:
        return Response(
            {"error": "User email not found"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Query books posted by this email, newest first
    books = Book.objects.filter(owner_email=owner_email).order_by('-id')
    
    # Serialize the books and return as JSON
    serializer = BookSerializer(books, many=True)
    
    # Return count and results
    return Response({
        'count': books.count(),
        'results': serializer.data
    })

class BookPostView(APIView):
    """
    API view for posting a new book.
    Implemented as a class-based view for more flexibility.
    """
    permission_classes = [AllowAny]  # Allow any user to post
    
    @csrf_exempt
    def post(self, request, *args, **kwargs):
        """Handle POST requests to create a new book"""
        # Create a serializer with the request data
        serializer = BookSerializer(data=request.data)
        
        # Check if data is valid according to serializer rules
        if serializer.is_valid():
            # Save the new book to the database
            serializer.save()
            # Return the created book data with 201 Created status
            return Response(serializer.data, status=201)
        
        # If data is invalid, return errors with 400 Bad Request status
        return Response(serializer.errors, status=400)
