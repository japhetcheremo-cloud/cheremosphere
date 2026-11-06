from django.urls import path
from .views import (
    NetworkFeedListView, NetworkPostDetailView, PostLikeToggleView,
    PostCommentCreateView, ConnectionToggleView, MyConnectionsListView
)

urlpatterns = [
    path('feed/', NetworkFeedListView.as_view(), name='network-feed'),
    path('posts/<int:pk>/', NetworkPostDetailView.as_view(), name='post-detail'),
    path('posts/<int:pk>/like/', PostLikeToggleView.as_view(), name='post-like-toggle'),
    path('posts/<int:post_id>/comments/', PostCommentCreateView.as_view(), name='post-comment-create'),
    path('connect/<int:user_id>/', ConnectionToggleView.as_view(), name='connection-toggle'),
    path('connections/', MyConnectionsListView.as_view(), name='my-connections'),
]
