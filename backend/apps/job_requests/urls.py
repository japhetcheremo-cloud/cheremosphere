from django.urls import path
from .views import (
    JobRequestListView, JobRequestDetailView,
    MyJobRequestsView, MarkJobRequestFulfilledView
)

urlpatterns = [
    path('requests/', JobRequestListView.as_view(), name='job-requests-list'),
    path('requests/<int:pk>/', JobRequestDetailView.as_view(), name='job-request-detail'),
    path('requests/my/', MyJobRequestsView.as_view(), name='my-job-requests'),
    path('requests/<int:pk>/toggle-fulfilled/', MarkJobRequestFulfilledView.as_view(), name='job-request-toggle-fulfilled'),
]
