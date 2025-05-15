from django.shortcuts import render, redirect, get_object_or_404
from django.db.models import Q
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse

from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView

from .models import Book
from .forms import BookForm
from .serializers import BookSerializer


# API Views
@api_view(['GET'])
def index(request):
    """List all books with optional search functionality."""
    search_query = request.GET.get('search', '')
    books = Book.objects.all().order_by('-id')
    
    if search_query:
        books = books.filter(
            Q(title__icontains=search_query) |
            Q(description__icontains=search_query) |
            Q(owner_name__icontains=search_query)
        )
    
    serializer = BookSerializer(books, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def book_detail(request, book_id):
    """Get detailed information about a specific book."""
    try:
        book = get_object_or_404(Book, id=book_id)
        serializer = BookSerializer(book)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_book(request, book_id):
    """Delete a book if user is the owner."""
    book = get_object_or_404(Book, id=book_id)
    
    if book.owner_name != request.user.username:
        return Response(
            {"error": "You don't have permission to delete this book"},
            status=status.HTTP_403_FORBIDDEN
        )
    
    book.delete()
    return Response({"message": "Book deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


@api_view(['PATCH', 'PUT'])
@permission_classes([IsAuthenticated])
def update_book(request, book_id):
    """Update an existing book if user is the owner."""
    try:
        book = get_object_or_404(Book, id=book_id)
        
        if book.owner_name != request.user.username:
            return Response(
                {"error": "You don't have permission to edit this book"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = BookSerializer(book, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Book updated successfully", "book": serializer.data})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def booked_by_me(request):
    """Display books booked by the authenticated user."""
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
    
    books = Book.objects.filter(booker_email=booker_email).order_by('-id')
    serializer = BookSerializer(books, many=True)
    
    return Response({
        'count': books.count(),
        'results': serializer.data
    })


@api_view(['GET'])
def posted_by_me(request):
    """Display books posted by the authenticated user."""
    user = request.user
    
    if not user.is_authenticated:
        return Response(
            {"error": "Authentication required"},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    user_email = user.email
    if not user_email:
        return Response(
            {"error": "User email not found"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if hasattr(Book, 'owner_email'):
        books = Book.objects.filter(owner_email=user_email).order_by('-id')
    elif hasattr(Book, 'owner_name'):
        books = Book.objects.filter(owner_name=user.username).order_by('-id')
    else:
        return Response(
            {"error": "No appropriate field to filter by owner"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    serializer = BookSerializer(books, many=True)
    
    return Response({
        'count': books.count(),
        'results': serializer.data
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def select_book(request, book_id):
    """Handle selecting (booking) a book via API."""
    book = get_object_or_404(Book, id=book_id)
    
    # Check if book is already booked
    if book.booker_name or book.booker_email:
        return Response(
            {"error": "This book is already booked"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Get current user info
    user = request.user
    book.booker_name = user.username
    book.booker_email = user.email
    book.save()
    
    return Response({
        'status': 'success', 
        'message': 'Book booked successfully',
        'book': BookSerializer(book).data
    }, status=status.HTTP_200_OK)


# HTML Template Views
@csrf_exempt
def post_book(request):
    """Handle posting a new book via HTML form."""
    if request.method == 'POST':
        form = BookForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, 'Book posted successfully!')
            return redirect('index')
    else:
        form = BookForm()
    
    return render(request, 'books/post.html', {'form': form})


@csrf_exempt
def select_book_form(request, book_id):
    """Handle selecting (booking) a book via HTML form."""
    book = get_object_or_404(Book, id=book_id)
    
    if request.method == 'POST':
        book.booker_name = request.POST.get('booker_name')
        book.booker_email = request.POST.get('booker_email')
        book.save()
        
        return JsonResponse({
            'status': 'success', 
            'message': 'Book booked successfully',
            'book': BookSerializer(book).data
        })
    
    return render(request, 'books/selectbook.html', {'book': book})


# Class-based Views
@method_decorator(csrf_exempt, name='dispatch')
class BookViewSet(viewsets.ModelViewSet):
    """ViewSet for Book model CRUD operations."""
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [AllowAny]
    
    @action(detail=True, methods=['post'])
    def select_book(self, request, pk=None):
        """Book a specific item."""
        try:
            book = self.get_object()
            
            if book.booker_name:
                return Response(
                    {"error": "This book is already booked"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            booker_name = request.data.get('booker_name')
            booker_email = request.data.get('booker_email')
            
            if not booker_name or not booker_email:
                return Response(
                    {"error": "Both name and email are required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            book.booker_name = booker_name
            book.booker_email = booker_email
            book.save()
            
            return Response(BookSerializer(book).data)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class BookPostView(APIView):
    """API view for posting a new book."""
    permission_classes = [AllowAny]
    
    @csrf_exempt
    def post(self, request, *args, **kwargs):
        serializer = BookSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        
        return Response(serializer.errors, status=400)
