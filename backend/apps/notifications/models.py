from django.db import models
from django.conf import settings


class Notification(models.Model):
    TYPE_CHOICES = [
        ('job_application', 'Job Application'),
        ('application_status', 'Application Status Update'),
        ('message', 'New Message'),
        ('connection_request', 'Connection Request'),
        ('connection_accepted', 'Connection Accepted'),
        ('post_comment', 'Comment on Post'),
        ('post_like', 'Reaction to Post'),
        ('marketplace_inquiry', 'Marketplace Product Inquiry'),
        ('system', 'System Notice'),
    ]

    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='sent_notifications')
    notification_type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    action_url = models.CharField(max_length=255, blank=True, default='')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.notification_type} for {self.recipient}: {self.title}"
