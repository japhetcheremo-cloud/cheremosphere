from rest_framework import serializers
from .models import NetworkPost, PostComment, PostLike, Connection
from accounts.serializers import UserSerializer


class PostCommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = PostComment
        fields = ['id', 'post', 'author', 'content', 'created_at']
        read_only_fields = ['id', 'author', 'created_at']


class NetworkPostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    comments = PostCommentSerializer(many=True, read_only=True)
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = NetworkPost
        fields = [
            'id', 'author', 'content', 'post_type', 'image',
            'likes_count', 'comments_count', 'comments', 'is_liked',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'author', 'likes_count', 'comments_count', 'created_at', 'updated_at']

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False


class NetworkPostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = NetworkPost
        fields = ['id', 'content', 'post_type', 'image']


class ConnectionSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)

    class Meta:
        model = Connection
        fields = ['id', 'sender', 'receiver', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'sender', 'created_at', 'updated_at']
