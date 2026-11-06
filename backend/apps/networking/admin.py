from django.contrib import admin
from .models import NetworkPost, PostComment, PostLike, Connection


@admin.register(NetworkPost)
class NetworkPostAdmin(admin.ModelAdmin):
    list_display = ('id', 'author', 'post_type', 'likes_count', 'comments_count', 'created_at')
    list_filter = ('post_type', 'created_at')
    search_fields = ('content', 'author__username')


@admin.register(PostComment)
class PostCommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'post', 'author', 'created_at')
    search_fields = ('content', 'author__username')


@admin.register(Connection)
class ConnectionAdmin(admin.ModelAdmin):
    list_display = ('sender', 'receiver', 'status', 'created_at')
    list_filter = ('status', 'created_at')
