from django.urls import path
from .views import (
    RegisterView, LoginView, LogoutView,
    CurrentUserProfileView, MemberListView, MemberDetailView
)

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('auth/login/', LoginView.as_view(), name='auth-login'),
    path('auth/logout/', LogoutView.as_view(), name='auth-logout'),
    path('profile/', CurrentUserProfileView.as_view(), name='current-user-profile'),
    path('members/', MemberListView.as_view(), name='member-list'),
    path('members/<int:pk>/', MemberDetailView.as_view(), name='member-detail'),
]
