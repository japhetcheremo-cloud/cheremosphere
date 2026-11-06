from django.db import models
from django.conf import settings


class NetworkPost(models.Model):
    POST_TYPES = [
        ('update', 'Professional Update'),
        ('achievement', 'Career Achievement'),
        ('opportunity', 'Opportunity / Vacancy Announcement'),
        ('business', 'Business Highlight'),
    ]

    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField()
    post_type = models.CharField(max_length=20, choices=POST_TYPES, default='update')
    image = models.ImageField(upload_to='posts/', blank=True, null=True)
    likes_count = models.PositiveIntegerField(default=0)
    comments_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Post by {self.author} on {self.created_at.strftime('%Y-%m-%d')}"


class PostComment(models.Model):
    post = models.ForeignKey(NetworkPost, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='network_comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Comment by {self.author} on Post #{self.post_id}"


class PostLike(models.Model):
    REACTION_TYPES = [
        ('like', 'Like'),
        ('celebrate', 'Celebrate'),
        ('support', 'Support'),
        ('insightful', 'Insightful'),
    ]
    post = models.ForeignKey(NetworkPost, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='post_likes')
    reaction = models.CharField(max_length=20, choices=REACTION_TYPES, default='like')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('post', 'user')


class Connection(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('connected', 'Connected'),
        ('declined', 'Declined'),
        ('blocked', 'Blocked'),
    ]
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_connections')
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_connections')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('sender', 'receiver')

    def __str__(self):
        return f"{self.sender} -> {self.receiver} ({self.status})"
