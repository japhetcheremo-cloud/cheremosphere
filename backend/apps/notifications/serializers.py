from rest_framework import serializers
from .models import Notification
from accounts.serializers import UserSerializer


class NotificationSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id', 'recipient', 'sender', 'notification_type', 'title',
            'message', 'action_url', 'is_read', 'created_at'
        ]
        read_only_fields = ['id', 'recipient', 'sender', 'created_at']
