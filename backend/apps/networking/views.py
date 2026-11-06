from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from .models import NetworkPost, PostComment, PostLike, Connection
from .serializers import (
    NetworkPostSerializer, NetworkPostCreateSerializer,
    PostCommentSerializer, ConnectionSerializer
)
from notifications.models import Notification


class NetworkFeedListView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return NetworkPostCreateSerializer
        return NetworkPostSerializer

    def get_queryset(self):
        queryset = NetworkPost.objects.all().select_related('author').prefetch_related('comments__author', 'likes')
        post_type = self.request.query_params.get('type')
        if post_type:
            queryset = queryset.filter(post_type=post_type)
        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class NetworkPostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = NetworkPost.objects.all()
    serializer_class = NetworkPostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_destroy(self, instance):
        if self.request.user != instance.author and not self.request.user.is_staff:
            raise permissions.PermissionDenied("You can only delete your own posts.")
        instance.delete()


class PostLikeToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            post = NetworkPost.objects.get(pk=pk)
        except NetworkPost.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

        like_qs = PostLike.objects.filter(post=post, user=request.user)
        if like_qs.exists():
            like_qs.delete()
            post.likes_count = max(0, post.likes_count - 1)
            post.save(update_fields=['likes_count'])
            return Response({'is_liked': False, 'likes_count': post.likes_count})
        else:
            PostLike.objects.create(post=post, user=request.user)
            post.likes_count += 1
            post.save(update_fields=['likes_count'])

            if post.author != request.user:
                Notification.objects.create(
                    recipient=post.author,
                    sender=request.user,
                    notification_type='post_like',
                    title='Reaction on your post',
                    message=f'{request.user.get_full_name() or request.user.username} liked your post.',
                    action_url=f'/network/posts/{post.id}'
                )

            return Response({'is_liked': True, 'likes_count': post.likes_count})


class PostCommentCreateView(generics.CreateAPIView):
    serializer_class = PostCommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        post = generics.get_object_or_404(NetworkPost, pk=self.kwargs['post_id'])
        comment = serializer.save(author=self.request.user, post=post)
        post.comments_count += 1
        post.save(update_fields=['comments_count'])

        if post.author != self.request.user:
            Notification.objects.create(
                recipient=post.author,
                sender=self.request.user,
                notification_type='post_comment',
                title='New comment on your post',
                message=f'{self.request.user.get_full_name() or self.request.user.username} commented on your post.',
                action_url=f'/network/posts/{post.id}'
            )


class ConnectionToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, user_id):
        from accounts.models import User
        if request.user.id == user_id:
            return Response({'error': 'Cannot connect with yourself'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            target_user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        conn = Connection.objects.filter(
            Q(sender=request.user, receiver=target_user) |
            Q(sender=target_user, receiver=request.user)
        ).first()

        if conn:
            conn.delete()
            return Response({'connected': False, 'status': 'none', 'message': 'Connection removed'})
        else:
            new_conn = Connection.objects.create(sender=request.user, receiver=target_user, status='connected')
            Notification.objects.create(
                recipient=target_user,
                sender=request.user,
                notification_type='connection_request',
                title='New Connection',
                message=f'{request.user.get_full_name() or request.user.username} connected with you.',
                action_url=f'/network/profile/{request.user.id}'
            )
            return Response({'connected': True, 'status': 'connected', 'message': 'Connected successfully'})


class MyConnectionsListView(generics.ListAPIView):
    serializer_class = ConnectionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Connection.objects.filter(Q(sender=user) | Q(receiver=user), status='connected')
