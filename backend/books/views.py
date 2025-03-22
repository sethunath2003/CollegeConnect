from django.shortcuts import render, redirect, get_object_or_404
from django.db.models import Q
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from .models import Book
from .forms import BookForm
from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import BookSerializer
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework import status

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

class BookViewSet(viewsets.ModelViewSet):
    """
    API viewset for Book model.
    
    Provides CRUD operations for books via REST API.
    """
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    parser_classes = (MultiPartParser, FormParser)  # Allow file uploads

    @csrf_exempt
    def get_queryset(self):
        """
        Custom queryset method to filter books.
        
        Shows only available books and handles search functionality.
        """
        # Get only available books
        queryset = Book.objects.filter(booker_name__isnull=True)
        
        # Apply search filter if search parameter exists
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(owner_name__icontains=search)
            )
        return queryset

    @csrf_exempt
    @action(detail=True, methods=['post'])
    def select_book(self, request, **kwargs):
        """
        Custom action to select (book) a book via API.
        
        Updates the book with booker information.
        """
        # Get the book object
        book = self.get_object()
        
        # Update with booker information
        book.booker_name = request.data.get('booker_name')
        book.booker_email = request.data.get('booker_email')
        book.save()
        
        # Return success response
        return Response({'status': 'book selected'})

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
