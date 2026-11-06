from django.urls import path
from .views import (
    NotificationListView, NotificationUnreadCountView,
    MarkNotificationReadView, MarkAllNotificationsReadView
)

urlpatterns = [
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('notifications/unread-count/', NotificationUnreadCountView.as_view(), name='notification-unread-count'),
    path('notifications/<int:pk>/read/', MarkNotificationReadView.as_view(), name='notification-mark-read'),
    path('notifications/read-all/', MarkAllNotificationsReadView.as_view(), name='notification-read-all'),
]
