# CollegeConnect - Interview Preparation Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technical Stack](#technical-stack)
3. [Architecture & Design Questions](#architecture--design-questions)
4. [Backend (Django) Questions](#backend-django-questions)
5. [Frontend (React) Questions](#frontend-react-questions)
6. [Database Design Questions](#database-design-questions)
7. [API Design & RESTful Services](#api-design--restful-services)
8. [Authentication & Security](#authentication--security)
9. [Feature-Specific Deep Dives](#feature-specific-deep-dives)
10. [Code Challenges & Problem Solving](#code-challenges--problem-solving)
11. [Best Practices & Optimization](#best-practices--optimization)
12. [Behavioral Questions](#behavioral-questions)

---

## Project Overview

### What is CollegeConnect?
CollegeConnect is a comprehensive full-stack web platform designed to streamline college life through three main features:
1. **Letter Drafting Assistance** - Automated formal letter generation with PDF export
2. **Study Material Exchange** - Peer-to-peer book sharing and marketplace
3. **Events & Hackathons** - Event discovery through web scraping

### Key Statistics
- **Tech Stack**: Django REST Framework (Backend) + React with Vite (Frontend)
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Features**: 3 major modules with 10+ API endpoints
- **Architecture**: Decoupled REST API architecture

---

## Technical Stack

### Backend Technologies
- **Framework**: Django 4.x with Django REST Framework
- **Database**: MySQL with MySQLClient
- **Authentication**: djangorestframework-simplejwt
- **PDF Generation**: ReportLab
- **Web Scraping**: BeautifulSoup4
- **CORS Handling**: django-cors-headers
- **Data Validation**: jsonschema

### Frontend Technologies
- **Framework**: React 18.3.1
- **Build Tool**: Vite 6.x
- **Styling**: Tailwind CSS 4.x with custom CSS
- **UI Components**: Material-UI (MUI) 6.x
- **Routing**: React Router DOM 7.x
- **HTTP Client**: Axios 1.8.x
- **Linting**: ESLint 9.x

### Development Tools
- **Version Control**: Git & GitHub
- **Package Managers**: npm (Frontend), pip (Backend)
- **Virtual Environment**: Python venv

---

## Architecture & Design Questions

### Q1: Explain the overall architecture of CollegeConnect.
**Answer:**
CollegeConnect follows a **decoupled client-server architecture** with:
- **Backend**: Django REST API serving JSON data over HTTP
- **Frontend**: React SPA (Single Page Application) consuming the API
- **Communication**: RESTful APIs with JWT authentication
- **Database**: MySQL for persistent storage

**Key Benefits:**
- Separation of concerns
- Independent scaling of frontend/backend
- Multiple client support (web, mobile future)
- Clear API contracts

### Q2: Why did you choose Django REST Framework over alternatives?
**Answer:**
- **Rapid Development**: Built-in ORM, authentication, and admin panel
- **DRF Features**: Serializers, ViewSets, and authentication classes
- **Security**: CSRF protection, SQL injection prevention
- **Scalability**: Good for MVP and scales well
- **Python Ecosystem**: Access to libraries like ReportLab, BeautifulSoup

### Q3: Why React with Vite instead of Create React App?
**Answer:**
- **Performance**: Vite offers faster build times (ES modules, esbuild)
- **Hot Module Replacement (HMR)**: Instant feedback during development
- **Modern**: Better tree-shaking and optimized production builds
- **Developer Experience**: Cleaner configuration, faster startup

### Q4: How does the frontend communicate with the backend?
**Answer:**
1. **Axios Instance**: Centralized API client (`/frontend/src/api/axios.js`)
2. **Base URL**: Points to Django backend (localhost:8000 in dev)
3. **JWT Tokens**: Stored in localStorage, sent in Authorization header
4. **Interceptors**: Automatically attach tokens to requests
5. **CORS**: Backend configured with django-cors-headers

### Q5: What design patterns are used in this project?
**Answer:**
- **MVC Pattern**: Django's Model-View-Template (adapted for API)
- **Repository Pattern**: Django ORM acts as repository
- **Serializer Pattern**: DRF serializers for data transformation
- **Component Pattern**: React functional components
- **HOC/Hooks**: React hooks for state management
- **Factory Pattern**: Token generation helper functions

---

## Backend (Django) Questions

### Q6: Explain the Django project structure.
**Answer:**
```
backend/
├── collegeconnect/      # Main project settings
│   ├── settings.py      # Configuration
│   ├── urls.py          # Root URL routing
│   └── wsgi.py          # WSGI entry point
├── accounts/            # User authentication app
├── books/               # Book exchange module
├── letters/             # Letter drafting module
├── events/              # Events scraping module
└── manage.py            # Django management script
```

### Q7: How does the authentication system work?
**Answer:**
1. **Registration** (`/api/accounts/register/`):
   - Validates username/email uniqueness
   - Creates Django User with hashed password
   - Generates JWT token pair (access + refresh)
   
2. **Login** (`/api/accounts/login/`):
   - Authenticates via email (looks up username)
   - Uses Django's `authenticate()` function
   - Returns JWT access token
   
3. **Token Storage**:
   - Frontend stores token in localStorage
   - Sent as `Bearer <token>` in Authorization header
   
4. **Protected Endpoints**:
   - Use `@permission_classes([IsAuthenticated])`
   - DRF validates token and attaches user to request

### Q8: Explain the Book model and its relationships.
**Answer:**
```python
class Book(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField()
    location = models.CharField(max_length=150)
    cost = models.FloatField()
    owner_name = models.CharField(max_length=150, default='Unknown')
    booker_name = models.CharField(max_length=150, blank=True, null=True)
    booker_email = models.CharField(max_length=150, blank=True, null=True)
    cover_image = models.ImageField(upload_to='book_covers/', blank=True)
```

**Key Features:**
- **Owner**: Stores username of book poster
- **Booker**: Tracks who reserved the book (name + email)
- **Availability**: If booker fields are null, book is available
- **Images**: File upload to `book_covers/` directory

### Q9: How does the Letter Drafting system work?
**Answer:**
The system uses a **template-driven approach**:

1. **LetterTemplate Model**:
   - Stores reusable letter templates
   - Contains `form_structure` (JSON) for frontend forms
   - Contains `pdf_structure` (JSON) for PDF generation
   - Includes `validation_schema` (JSON Schema) for validation

2. **LetterDraft Model**:
   - Stores user-created drafts
   - Links to user (ForeignKey)
   - Links to template (ForeignKey)
   - Stores `template_data` (JSON) with filled values

3. **PDF Generation**:
   - Uses ReportLab library
   - `generate_pdf_from_template_structure()` function
   - Parses `pdf_structure` JSON to build PDF
   - Returns PDF as binary buffer

4. **Workflow**:
   ```
   User → Choose Template → Fill Form → Validate → Generate PDF / Save Draft
   ```

### Q10: What are Django serializers and how are they used?
**Answer:**
Serializers convert complex Django models to JSON and vice versa:

**Example - BookSerializer:**
```python
class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'
```

**Benefits:**
- **Validation**: Automatic field validation
- **Transformation**: Model ↔ JSON conversion
- **Nested Data**: Handle relationships
- **Read-only fields**: Control what's editable

**Used in views:**
```python
serializer = BookSerializer(book)
return Response(serializer.data)  # Returns JSON
```

### Q11: How do you handle file uploads in Django?
**Answer:**
1. **Model Configuration**:
   ```python
   cover_image = models.ImageField(upload_to='book_covers/')
   ```

2. **Settings Configuration**:
   ```python
   MEDIA_URL = '/media/'
   MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
   ```

3. **URL Configuration**:
   ```python
   urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
   ```

4. **API View**:
   - Use `request.FILES` to access uploaded files
   - Serializer handles file field automatically
   - Files stored in `MEDIA_ROOT/book_covers/`

### Q12: Explain the web scraping implementation for events.
**Answer:**
**File**: `events/scraper.py` and `events/views.py`

1. **Target**: Scrapes hackathons from reskilll.com/allhacks
2. **Library**: BeautifulSoup4 for HTML parsing
3. **Process**:
   ```python
   response = requests.get(url)
   soup = BeautifulSoup(response.content, 'html.parser')
   events = soup.find_all("div", class_="hackathonCard")
   ```

4. **Data Extraction**:
   - Event title, description, image URL
   - Registration dates (start/end)
   - Event URL for registration

5. **Storage**:
   - Checks for duplicate titles (unique constraint)
   - Creates/updates Event objects
   - Returns newly created count

### Q13: What is the purpose of `@api_view` decorator?
**Answer:**
The `@api_view` decorator converts function-based views to DRF views:

```python
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def my_view(request):
    return Response({'data': 'value'})
```

**Benefits:**
- **HTTP Method Restriction**: Only allows specified methods
- **DRF Features**: Access to `request.data`, automatic parsing
- **Response Objects**: Return `Response` objects with status codes
- **Authentication**: Works with permission classes
- **Browsable API**: Generates HTML interface for testing

### Q14: How do you handle CORS in this project?
**Answer:**
Uses `django-cors-headers` package:

1. **Installation**: `pip install django-cors-headers`
2. **Middleware** (settings.py):
   ```python
   MIDDLEWARE = [
       'corsheaders.middleware.CorsMiddleware',
       'django.middleware.common.CommonMiddleware',
       ...
   ]
   ```

3. **Configuration**:
   ```python
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:5173",  # Vite dev server
   ]
   # Or for development:
   CORS_ALLOW_ALL_ORIGINS = True
   ```

---

## Frontend (React) Questions

### Q15: Explain the React component structure.
**Answer:**
```
src/
├── main.jsx              # Entry point
├── App.jsx               # Root component with routing
├── pages/                # Full page components
│   ├── LandingPage.jsx   # Marketing page
│   ├── Login.jsx         # Auth page
│   ├── Homepage.jsx      # Dashboard
│   └── EventsPage.jsx    # Events listing
├── modules/              # Feature modules
│   ├── Books/            # Book exchange components
│   └── Letters/          # Letter drafting components
├── components/           # Shared components
│   ├── Navigation.jsx    # Header/navbar
│   └── LoadingScreen.jsx # Loading indicator
└── api/
    └── axios.js          # API client configuration
```

### Q16: How is routing implemented in the application?
**Answer:**
Uses **React Router v7**:

```javascript
<Router>
  <Navigation />
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/homepage" element={<Homepage />} />
    <Route path="/bookexchange" element={<BookList />} />
    <Route path="/bookexchange/book/:id" element={<BookDetail />} />
    <Route path="/letter-drafting" element={<LetterDraft />} />
    <Route path="/eventlister" element={<EventsPage />} />
  </Routes>
</Router>
```

**Key Features:**
- **Dynamic Routes**: `:id` parameter for book details
- **Nested Routes**: `/bookexchange/*` for book features
- **Protected Routes**: Check auth in components
- **Navigation Component**: Persistent across routes

### Q17: How is authentication managed on the frontend?
**Answer:**
**Token Storage & Management:**
```javascript
// Login
localStorage.setItem('token', response.data.token);
localStorage.setItem('user', JSON.stringify(userData));

// Check Auth
const isAuthenticated = !!localStorage.getItem('token');

// Logout
localStorage.removeItem('token');
localStorage.removeItem('user');
delete axios.defaults.headers.common['Authorization'];
```

**Axios Interceptor (App.jsx):**
```javascript
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});
```

**Auto-logout on Inactivity:**
- Tracks user activity (mouse, keyboard, scroll)
- 20-minute inactivity timeout
- Automatically clears tokens and redirects to login

### Q18: Explain the state management approach.
**Answer:**
Uses **React Hooks** (no Redux needed for this size):

1. **useState**: Component-level state
   ```javascript
   const [books, setBooks] = useState([]);
   const [loading, setLoading] = useState(true);
   ```

2. **useEffect**: Side effects (API calls, subscriptions)
   ```javascript
   useEffect(() => {
     fetchBooks();
   }, []);
   ```

3. **localStorage**: Persistent state (auth tokens)

4. **useNavigate**: Programmatic navigation
   ```javascript
   const navigate = useNavigate();
   navigate('/homepage');
   ```

**Why no Redux?**
- App complexity doesn't justify Redux overhead
- Most state is server-synchronized (API calls)
- Auth state in localStorage is sufficient
- Component-level state meets all needs

### Q19: How are API calls structured in the frontend?
**Answer:**
**Centralized Axios Instance** (`api/axios.js`):
```javascript
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
});

export default instance;
```

**Usage in Components**:
```javascript
import api from '../api/axios';

// GET request
const response = await api.get('/books/');
setBooks(response.data);

// POST request
await api.post('/books/', bookData);

// With auth (automatic via interceptor)
const drafts = await api.get('/letters/drafts/');
```

### Q20: What styling approach is used and why?
**Answer:**
**Hybrid Approach**:
1. **Tailwind CSS**: Utility-first classes for rapid development
   ```jsx
   <div className="flex items-center justify-between bg-gray-900 p-4">
   ```

2. **Custom CSS**: Complex animations and global styles (index.css)

3. **Material-UI**: Pre-built components for complex UI
   ```jsx
   import { Button, TextField } from '@mui/material';
   ```

**Benefits:**
- **Tailwind**: Fast prototyping, consistent spacing
- **MUI**: Professional components (forms, dialogs)
- **Custom CSS**: Brand-specific styling

### Q21: How do you handle form submissions?
**Answer:**
**Example - Login Form**:
```javascript
const handleLogin = async (e) => {
  e.preventDefault();  // Prevent page reload
  
  try {
    const response = await api.post('/accounts/login/', {
      email,
      password
    });
    
    localStorage.setItem('token', response.data.token);
    navigate('/homepage');
  } catch (error) {
    setError(error.response?.data?.error || 'Login failed');
  }
};
```

**Best Practices:**
- Prevent default form submission
- Show loading state during submission
- Display error messages from backend
- Clear sensitive data after submission
- Navigate on success

### Q22: Explain the file upload implementation.
**Answer:**
**Form with File Input**:
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('cover_image', imageFile);  // File object
  
  await api.post('/books/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
```

**File Input**:
```jsx
<input 
  type="file" 
  accept="image/*"
  onChange={(e) => setImageFile(e.target.files[0])}
/>
```

---

## Database Design Questions

### Q23: Explain the database schema.
**Answer:**
**Core Models:**

1. **User** (Django built-in):
   - id, username, email, password (hashed)
   
2. **Profile** (accounts app):
   - user (OneToOne to User)
   - full_name, department, degree_program
   - semester, year

3. **Book** (books app):
   - title, description, location, cost
   - owner_name, booker_name, booker_email
   - cover_image (file path)

4. **Event** (events app):
   - title (unique), description
   - image_url, link, event_url
   - registration_start, registration_end
   - created_at, updated_at

5. **LetterTemplate** (letters app):
   - name, template_type (unique)
   - form_structure (JSON)
   - pdf_structure (JSON)
   - validation_schema (JSON)

6. **LetterDraft** (letters app):
   - user (FK to User)
   - template (FK to LetterTemplate)
   - letter_type, template_data (JSON)
   - created_at, updated_at

### Q24: Why use JSONField for letter templates?
**Answer:**
**Advantages:**
- **Flexibility**: Different templates need different fields
- **Dynamic Forms**: Frontend can render forms from JSON structure
- **No Schema Changes**: Add new templates without migrations
- **Complex Structures**: Nested data for PDF generation

**Example Structure**:
```json
{
  "form_structure": {
    "fields": [
      {"name": "recipient_name", "type": "text", "label": "Recipient Name"},
      {"name": "subject", "type": "text", "label": "Subject"}
    ]
  },
  "pdf_structure": {
    "paragraphs": [
      {"text": "Dear {{recipient_name}},"},
      {"text": "Subject: {{subject}}"}
    ]
  }
}
```

### Q25: How would you optimize database queries?
**Answer:**
**Current Implementation:**
```python
books = Book.objects.all().order_by('-id')
```

**Optimization Techniques:**

1. **Select Related** (for foreign keys):
   ```python
   drafts = LetterDraft.objects.select_related('user', 'template')
   ```

2. **Prefetch Related** (for many relationships):
   ```python
   users = User.objects.prefetch_related('letter_drafts')
   ```

3. **Database Indexes**:
   ```python
   class Meta:
       indexes = [
           models.Index(fields=['owner_name']),
           models.Index(fields=['booker_email']),
       ]
   ```

4. **Pagination**:
   ```python
   from rest_framework.pagination import PageNumberPagination
   ```

5. **Query Filtering**:
   ```python
   books = Book.objects.filter(booker_email__isnull=True)  # Available only
   ```

### Q26: What are database migrations and how do you use them?
**Answer:**
**Purpose**: Track and apply database schema changes

**Workflow:**
```bash
# 1. Create migration after model changes
python manage.py makemigrations

# 2. View SQL that will be executed
python manage.py sqlmigrate books 0001

# 3. Apply migrations
python manage.py migrate

# 4. Check status
python manage.py showmigrations
```

**Migration File Example**:
```python
class Migration(migrations.Migration):
    dependencies = [('books', '0001_initial')]
    
    operations = [
        migrations.AddField(
            model_name='book',
            name='booker_email',
            field=models.CharField(max_length=150, null=True),
        ),
    ]
```

---

## API Design & RESTful Services

### Q27: What RESTful principles are followed?
**Answer:**
**1. Resource-Based URLs:**
```
GET    /api/books/              # List all books
POST   /api/books/              # Create book
GET    /api/books/1/            # Get book details
PUT    /api/books/1/            # Update book
DELETE /api/books/1/            # Delete book
```

**2. HTTP Methods:**
- GET: Retrieve resources
- POST: Create resources
- PUT/PATCH: Update resources
- DELETE: Remove resources

**3. Stateless Communication:**
- Each request contains auth token
- Server doesn't maintain session state

**4. JSON Data Format:**
- Request and response bodies use JSON
- Content-Type: application/json

**5. HTTP Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

### Q28: List all API endpoints in the project.
**Answer:**

**Authentication (`/api/accounts/`):**
- `POST /register/` - Create new user account
- `POST /login/` - Authenticate user
- `GET /profile/` - Get user profile (protected)

**Books (`/api/books/`):**
- `GET /` - List all books (with search)
- `POST /` - Create new book listing (protected)
- `GET /{id}/` - Get book details
- `PUT /{id}/` - Update book (protected)
- `DELETE /{id}/` - Delete book (protected)
- `POST /{id}/select/` - Reserve/book a book (protected)
- `GET /posted/` - Books posted by current user (protected)
- `GET /booked/` - Books booked by current user (protected)

**Letters (`/api/letters/`):**
- `GET /templates/` - Get all letter templates
- `POST /generate/` - Generate PDF letter (protected)
- `POST /drafts/` - Save letter draft (protected)
- `GET /drafts/` - List user's drafts (protected)
- `GET /drafts/{id}/` - Get specific draft (protected)
- `PUT /drafts/{id}/` - Update draft (protected)
- `DELETE /drafts/{id}/` - Delete draft (protected)

**Events (`/api/events/`):**
- `GET /scraper/` - Trigger scraper and get events
- `GET /` - List all events

### Q29: How do you handle API errors?
**Answer:**
**Backend Error Handling:**
```python
@api_view(['POST'])
def my_view(request):
    try:
        # Process request
        data = request.data
        if not data.get('required_field'):
            return Response(
                {'error': 'required_field is missing'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Success
        return Response({'message': 'Success'})
        
    except ObjectDoesNotExist:
        return Response(
            {'error': 'Resource not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
```

**Frontend Error Handling:**
```javascript
try {
  const response = await api.post('/books/', bookData);
  setSuccess('Book posted successfully');
} catch (error) {
  if (error.response) {
    // Server responded with error
    setError(error.response.data.error || 'Operation failed');
  } else if (error.request) {
    // No response from server
    setError('Network error. Please try again.');
  } else {
    setError('An unexpected error occurred');
  }
}
```

### Q30: What is the difference between PUT and PATCH?
**Answer:**
- **PUT**: Replace entire resource
  ```python
  # Must send all fields
  {"title": "New Title", "description": "...", "cost": 100, ...}
  ```

- **PATCH**: Partial update
  ```python
  # Send only changed fields
  {"cost": 150}
  ```

**In DRF:**
```python
@api_view(['PATCH', 'PUT'])
def update_book(request, book_id):
    serializer = BookSerializer(book, data=request.data, partial=True)
    # partial=True allows PATCH
```

---

## Authentication & Security

### Q31: Explain JWT authentication in detail.
**Answer:**
**JWT Structure:**
```
Header.Payload.Signature
```

**Example Token:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImpvaG4iLCJleHAiOjE2MzM5ODc2MDB9.
6yH_abc123...
```

**Workflow:**
1. User logs in with credentials
2. Server validates and generates JWT
3. Token sent to client
4. Client stores token (localStorage)
5. Client sends token in header: `Authorization: Bearer <token>`
6. Server validates token signature and expiry
7. Server extracts user info from token payload

**Benefits:**
- Stateless (no session storage)
- Scalable (no server-side sessions)
- Secure (signed with secret key)
- Cross-domain (can use across services)

### Q32: How do you protect against common security vulnerabilities?
**Answer:**

**1. SQL Injection:**
- ✅ Use Django ORM (parameterized queries)
- ❌ Never use raw SQL with user input

**2. XSS (Cross-Site Scripting):**
- ✅ React escapes content by default
- ✅ Use `dangerouslySetInnerHTML` only when necessary
- ✅ Validate and sanitize user input

**3. CSRF (Cross-Site Request Forgery):**
- ✅ Django CSRF tokens (disabled for API)
- ✅ JWT tokens prevent CSRF on API
- ✅ SameSite cookies for session-based auth

**4. Authentication Issues:**
- ✅ Password hashing (Django's PBKDF2)
- ✅ Token expiry (JWT expiration)
- ✅ HTTPS in production
- ✅ Rate limiting (can add with django-ratelimit)

**5. Unauthorized Access:**
- ✅ Permission classes (`IsAuthenticated`)
- ✅ Ownership checks in views
  ```python
  if book.owner_name != request.user.username:
      return Response({'error': 'Forbidden'}, status=403)
  ```

**6. File Upload Security:**
- ✅ Validate file types (images only)
- ✅ File size limits
- ✅ Scan for malicious content (can add)

### Q33: How is password security handled?
**Answer:**
**Django's Built-in Security:**
```python
# Registration
user = User.objects.create_user(
    username=username,
    email=email,
    password=password  # Automatically hashed
)
```

**Hashing Algorithm:**
- PBKDF2 with SHA256 (Django default)
- 260,000 iterations (Django 4.x)
- Automatic salt generation

**Password Storage:**
```
pbkdf2_sha256$260000$salt$hash
```

**Authentication:**
```python
user = authenticate(username=username, password=password)
# Django compares hashed passwords
```

**Best Practices:**
- Never store plain-text passwords
- Use strong hashing algorithms
- Implement password complexity rules
- Add rate limiting for login attempts

### Q34: How do you handle session timeout?
**Answer:**
**Frontend Implementation (App.jsx):**
```javascript
const INACTIVITY_TIMEOUT = 20 * 60 * 1000; // 20 minutes

useEffect(() => {
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll'];
  const updateActivity = () => setLastActivity(Date.now());
  
  events.forEach(event => 
    window.addEventListener(event, updateActivity)
  );
  
  const checkInactivity = setInterval(() => {
    if (Date.now() - lastActivity > INACTIVITY_TIMEOUT) {
      // Auto-logout
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  }, 60000); // Check every minute
  
  return () => {
    events.forEach(event => 
      window.removeEventListener(event, updateActivity)
    );
    clearInterval(checkInactivity);
  };
}, [lastActivity]);
```

---

## Feature-Specific Deep Dives

### Q35: Walk through the book exchange workflow.
**Answer:**
**1. Posting a Book:**
```
User (authenticated) → Fill Form → Upload Image → POST /api/books/
→ Server validates → Save to DB → Return book ID
```

**2. Browsing Books:**
```
User → Visit /bookexchange → GET /api/books/
→ Display cards with images → Click for details
```

**3. Searching Books:**
```
User → Enter search term → GET /api/books/?search=python
→ Backend filters (Q objects) → Return matching books
```

**4. Booking a Book:**
```
User (authenticated) → Click "Book" → POST /api/books/{id}/select/
→ Check availability → Set booker_name/email → Return confirmation
```

**5. My Posted Books:**
```
User → View "Posted by Me" → GET /api/books/posted/
→ Filter by owner_name === username → Display with edit/delete
```

**6. My Booked Books:**
```
User → View "Booked by Me" → GET /api/books/booked/
→ Filter by booker_email === user.email → Display booked books
```

### Q36: How does dynamic letter generation work?
**Answer:**
**Template Creation (Admin/Database):**
```json
{
  "name": "Internship Application",
  "template_type": "internship",
  "form_structure": {
    "fields": [
      {"name": "company_name", "type": "text", "required": true},
      {"name": "position", "type": "text", "required": true},
      {"name": "student_name", "type": "text", "required": true}
    ]
  },
  "pdf_structure": {
    "paragraphs": [
      {"text": "To,", "style": "Normal"},
      {"text": "The Hiring Manager,", "style": "Normal"},
      {"text": "{{company_name}}", "style": "Bold"},
      {"text": "", "style": "Spacer"},
      {"text": "Subject: Application for {{position}}", "style": "Bold"},
      {"text": "", "style": "Spacer"},
      {"text": "Dear Sir/Madam,", "style": "Normal"},
      {"text": "I, {{student_name}}, am writing to apply...", "style": "Normal"}
    ]
  }
}
```

**Frontend Rendering:**
1. Fetch templates: `GET /api/letters/templates/`
2. Parse `form_structure` JSON
3. Dynamically render form fields
4. User fills in values

**PDF Generation:**
1. User submits form with data
2. POST to `/api/letters/generate/`
3. Backend fetches template
4. Validates data against `validation_schema`
5. Parses `pdf_structure`
6. Replaces `{{placeholders}}` with user data
7. Uses ReportLab to generate PDF
8. Returns PDF as binary stream

**Draft Saving:**
1. User clicks "Save Draft"
2. POST to `/api/letters/drafts/`
3. Saves JSON data with template reference
4. Can edit later: PUT `/api/letters/drafts/{id}/`

### Q37: Explain the event scraping architecture.
**Answer:**
**Scraper Function (`events/scraper.py`):**
```python
def scrape_events():
    url = "https://reskilll.com/allhacks"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    events = []
    cards = soup.find_all("div", class_="hackathonCard")
    
    for card in cards:
        event_data = {
            'title': card.find('a', class_='eventName').text.strip(),
            'description': card.find('div', class_='eventDescription').text.strip(),
            'image_url': card.find('img')['src'],
            'event_url': card.find('a')['href'],
            # ... more fields
        }
        
        # Create or update event
        event, created = Event.objects.get_or_create(
            title=event_data['title'],
            defaults=event_data
        )
        events.append({'newly_created': created, **event_data})
    
    return events
```

**API Endpoint:**
```python
@api_view(['GET'])
def run_scraper(request):
    events = scrape_events()
    return JsonResponse({
        'status': 200,
        'message': f'Scraped {len(events)} events',
        'new_event_count': sum(1 for e in events if e['newly_created']),
        'events': events
    })
```

**Frontend Display:**
1. Call `GET /api/events/scraper/`
2. Display event cards with images
3. Link to external registration pages

**Challenges:**
- Website structure changes (brittle)
- Rate limiting / IP blocking
- Data consistency
- Scheduled updates (can add with Celery)

---

## Code Challenges & Problem Solving

### Q38: Write a function to validate book availability before booking.
**Answer:**
```python
def validate_and_book(book_id, user):
    """
    Validates book availability and books it for the user.
    Returns (success: bool, message: str, book: Book or None)
    """
    try:
        book = Book.objects.get(id=book_id)
    except Book.DoesNotExist:
        return False, "Book not found", None
    
    # Check if already booked
    if book.booker_name or book.booker_email:
        return False, f"Book already booked by {book.booker_name}", None
    
    # Check if user is the owner
    if book.owner_name == user.username:
        return False, "You cannot book your own book", None
    
    # Book the item
    book.booker_name = user.username
    book.booker_email = user.email
    book.save()
    
    return True, "Book successfully booked", book

# Usage in view
success, message, book = validate_and_book(book_id, request.user)
if success:
    return Response({'message': message, 'book': BookSerializer(book).data})
else:
    return Response({'error': message}, status=400)
```

### Q39: Implement a search feature with multiple filters.
**Answer:**
```python
from django.db.models import Q

@api_view(['GET'])
def search_books(request):
    """
    Search books with multiple filters:
    - search: Text search in title/description/owner
    - min_cost/max_cost: Price range
    - available: Only show available books
    - location: Filter by location
    """
    books = Book.objects.all()
    
    # Text search
    search_query = request.GET.get('search', '')
    if search_query:
        books = books.filter(
            Q(title__icontains=search_query) |
            Q(description__icontains=search_query) |
            Q(owner_name__icontains=search_query)
        )
    
    # Price range
    min_cost = request.GET.get('min_cost')
    max_cost = request.GET.get('max_cost')
    if min_cost:
        books = books.filter(cost__gte=float(min_cost))
    if max_cost:
        books = books.filter(cost__lte=float(max_cost))
    
    # Availability filter
    if request.GET.get('available') == 'true':
        books = books.filter(booker_name__isnull=True)
    
    # Location filter
    location = request.GET.get('location')
    if location:
        books = books.filter(location__icontains=location)
    
    # Ordering
    order_by = request.GET.get('order_by', '-id')
    books = books.order_by(order_by)
    
    serializer = BookSerializer(books, many=True)
    return Response({
        'count': books.count(),
        'results': serializer.data
    })
```

### Q40: Create a React hook for fetching and caching data.
**Answer:**
```javascript
import { useState, useEffect } from 'react';
import api from '../api/axios';

/**
 * Custom hook for fetching data with loading and error states
 * Includes basic caching to prevent unnecessary refetches
 */
const useApiData = (endpoint, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let isMounted = true;  // Prevent state updates if unmounted
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get(endpoint);
        
        if (isMounted) {
          setData(response.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.error || 'Failed to fetch data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchData();
    
    return () => {
      isMounted = false;  // Cleanup
    };
  }, dependencies);
  
  const refetch = () => {
    setLoading(true);
    // Trigger useEffect by updating a dependency
  };
  
  return { data, loading, error, refetch };
};

// Usage
function BookList() {
  const { data: books, loading, error } = useApiData('/books/');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {books.map(book => <BookCard key={book.id} book={book} />)}
    </div>
  );
}
```

---

## Best Practices & Optimization

### Q41: How would you optimize the application's performance?
**Answer:**

**Backend Optimizations:**
1. **Database Query Optimization:**
   - Use `select_related()` and `prefetch_related()`
   - Add database indexes on frequently queried fields
   - Implement pagination for large datasets
   - Use `only()` and `defer()` to limit fields

2. **Caching:**
   ```python
   from django.core.cache import cache
   
   def get_books():
       books = cache.get('all_books')
       if not books:
           books = list(Book.objects.all())
           cache.set('all_books', books, timeout=300)  # 5 min
       return books
   ```

3. **API Response Optimization:**
   - Compress responses (gzip)
   - Minimize serializer fields
   - Use `SerializerMethodField` sparingly

**Frontend Optimizations:**
1. **Code Splitting:**
   ```javascript
   const BookList = lazy(() => import('./modules/Books/BookList'));
   
   <Suspense fallback={<Loading />}>
     <BookList />
   </Suspense>
   ```

2. **Image Optimization:**
   - Compress images before upload
   - Use appropriate image formats (WebP)
   - Lazy load images
   - Implement CDN for static assets

3. **React Optimizations:**
   - Use `React.memo()` for expensive components
   - Implement virtualization for long lists
   - Debounce search inputs
   - Use `useMemo()` and `useCallback()`

4. **Bundle Optimization:**
   - Tree shaking (Vite does this)
   - Remove unused dependencies
   - Analyze bundle size

### Q42: What improvements would you make to this project?
**Answer:**

**Feature Enhancements:**
1. **User Profiles:**
   - Profile pictures
   - Bio and interests
   - Rating system for book exchanges

2. **Messaging System:**
   - Direct messaging between users
   - Negotiate book prices
   - Ask questions about books

3. **Advanced Search:**
   - Filters by department, semester
   - Sort by price, date, popularity
   - Save search preferences

4. **Notifications:**
   - Email notifications for bookings
   - Browser push notifications
   - In-app notification center

5. **Reviews & Ratings:**
   - Rate book exchanges
   - Review letter templates
   - Report inappropriate content

**Technical Improvements:**
1. **Testing:**
   - Achieve 80%+ code coverage
   - Add integration tests
   - Implement CI/CD pipeline

2. **Performance:**
   - Add Redis caching
   - Implement CDN for static assets
   - Optimize database queries
   - Add lazy loading

3. **Security:**
   - Rate limiting on APIs
   - Input sanitization
   - File upload validation
   - Security headers (HSTS, CSP)

4. **Code Quality:**
   - Add TypeScript to frontend
   - Implement pre-commit hooks
   - Add code documentation
   - Follow PEP 8 / ESLint strictly

5. **DevOps:**
   - Docker containerization
   - Kubernetes orchestration
   - Automated testing in CI
   - Blue-green deployment

---

## Behavioral Questions

### Q43: Tell me about a challenging bug you fixed in this project.
**Answer Structure:**
"While implementing the book booking feature, I encountered a race condition where multiple users could book the same book simultaneously. 

**Problem**: Two users clicking 'Book' at the exact same time would both see the book as available, and both requests would succeed, resulting in duplicate bookings.

**Solution**: I implemented database-level constraints and transaction handling:
```python
from django.db import transaction

@transaction.atomic
def book_item(book_id, user):
    # Lock the row until transaction completes
    book = Book.objects.select_for_update().get(id=book_id)
    
    if book.booker_name:
        raise AlreadyBookedError()
    
    book.booker_name = user.username
    book.booker_email = user.email
    book.save()
```

**Result**: Eliminated race conditions and ensured data consistency. This taught me the importance of considering concurrency in web applications."

### Q44: How did you ensure code quality and maintainability?
**Answer:**
1. **Code Organization:**
   - Separated concerns (models, views, serializers)
   - Created reusable components in React
   - Used meaningful variable names

2. **Documentation:**
   - Docstrings for Python functions
   - Comments for complex logic
   - README with setup instructions

3. **Version Control:**
   - Meaningful commit messages
   - Feature branches
   - Code reviews (if team project)

4. **Coding Standards:**
   - Followed PEP 8 for Python
   - ESLint for JavaScript
   - Consistent formatting

5. **Error Handling:**
   - Try-catch blocks
   - User-friendly error messages
   - Logging for debugging

### Q45: How did you work with your team on this project?
**Answer:**
"Our team of 4 developers used Agile methodology:

**Collaboration:**
- Daily standups to discuss progress
- GitHub for version control and code reviews
- Trello for task management

**Division of Work:**
- I focused on the backend API and database design
- Team members worked on frontend, scraping, and design

**Challenges:**
- Merge conflicts: Resolved by communication and clear module boundaries
- Different coding styles: Established coding standards document
- Integration issues: Created API documentation for consistency

**Learning:**
- Importance of clear communication
- Value of code reviews
- Benefits of modular architecture"

### Q46: What would you do differently if you started this project today?
**Answer:**
1. **Planning Phase:**
   - More detailed requirements gathering
   - Create wireframes and mockups first
   - Define API contracts before coding

2. **Architecture:**
   - Use TypeScript for type safety
   - Implement GraphQL for flexible queries
   - Add Docker from the start

3. **Testing:**
   - Write tests alongside code (TDD)
   - Set up CI/CD pipeline early
   - Automated testing before merges

4. **Documentation:**
   - API documentation with Swagger/OpenAPI
   - Component documentation with Storybook
   - Architecture decision records (ADRs)

5. **Security:**
   - Security review at each milestone
   - Implement rate limiting from start
   - Use security scanning tools

6. **Performance:**
   - Profile and optimize early
   - Set performance budgets
   - Monitor from day one

---

## Quick Reference - Common Interview Topics

### Python/Django Concepts to Review:
- ORM and QuerySets
- Migrations
- Middleware
- Signals
- Class-based vs function-based views
- Django admin customization
- Custom management commands

### React Concepts to Review:
- Component lifecycle
- Hooks (useState, useEffect, useContext, useReducer)
- Context API
- React Router
- Performance optimization (memo, useMemo, useCallback)
- Error boundaries
- Virtual DOM

### General Web Development:
- HTTP methods and status codes
- RESTful API design
- Authentication vs Authorization
- CORS
- Caching strategies
- Database indexing
- N+1 query problem

### System Design Topics:
- Scalability
- Load balancing
- Caching layers (Redis, Memcached)
- CDN
- Microservices vs Monolith
- Message queues
- Database replication

---

## Practice Questions to Prepare

1. "How would you add a feature for users to bookmark favorite books?"
2. "Explain how you'd implement a recommendation system."
3. "How would you handle if the scraping website changes its structure?"
4. "What if we need to support multiple languages?"
5. "How would you scale this to 10,000 concurrent users?"
6. "Explain your error handling strategy."
7. "How do you ensure data consistency across the application?"
8. "What metrics would you track for this application?"
9. "How would you debug a slow API endpoint?"
10. "Describe how you'd migrate from SQLite to PostgreSQL."

---

## Tips for the Interview

### Technical Interview:
✅ **Do:**
- Walk through your thought process
- Ask clarifying questions
- Discuss trade-offs
- Mention edge cases
- Write clean, readable code
- Test your code

❌ **Don't:**
- Jump to coding without understanding
- Ignore edge cases
- Write messy code
- Get stuck silently (ask for hints)
- Over-complicate solutions

### Behavioral Interview:
✅ **Use STAR Method:**
- **S**ituation: Set the context
- **T**ask: Describe the challenge
- **A**ction: Explain what you did
- **R**esult: Share the outcome

### System Design Interview:
1. Clarify requirements
2. Define core features
3. High-level architecture
4. Data models
5. API design
6. Scalability considerations
7. Trade-offs and alternatives

---

## Additional Resources

### Books:
- "Two Scoops of Django" - Django best practices
- "Full Stack Python" - Complete Python web development
- "Learning React" by Kirupa Chinnathamby

### Online:
- Django documentation: https://docs.djangoproject.com/
- React documentation: https://react.dev/
- DRF documentation: https://www.django-rest-framework.org/

### Practice:
- LeetCode for algorithms
- HackerRank for Python/SQL
- FrontendMentor for React projects

---

## Final Checklist

Before the interview, make sure you can:
- [ ] Explain the entire architecture in 2 minutes
- [ ] Draw the database schema from memory
- [ ] List all API endpoints and their purposes
- [ ] Explain authentication flow step-by-step
- [ ] Code basic CRUD operations without reference
- [ ] Discuss 3 challenges you faced and solved
- [ ] Describe what you learned from the project
- [ ] Suggest 5 improvements you'd make
- [ ] Explain security measures implemented
- [ ] Discuss how you'd scale the application

---

**Good luck with your interview! 🚀**

Remember: It's okay to say "I don't know" but follow it with "but here's how I would find out" or "here's my best guess based on similar problems I've solved."
