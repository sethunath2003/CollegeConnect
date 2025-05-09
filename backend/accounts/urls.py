from django.urls import path
from .views import register_user, login_user, get_user_profile

urlpatterns = [
    # Existing paths
    path('register/', register_user, name='register_user'),
    path('login/', login_user, name='login_user'),
    
    # New profile endpoint
    path('profile/', get_user_profile, name='get_user_profile'),
]