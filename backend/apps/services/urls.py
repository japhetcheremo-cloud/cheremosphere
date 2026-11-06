from django.urls import path
from .views import (
    ServiceCategoryListView, FreelanceServiceListView,
    FreelanceServiceDetailView, MyFreelanceServicesView
)

urlpatterns = [
    path('categories/', ServiceCategoryListView.as_view(), name='service-categories'),
    path('services/', FreelanceServiceListView.as_view(), name='services-list'),
    path('services/<int:pk>/', FreelanceServiceDetailView.as_view(), name='service-detail'),
    path('services/my/', MyFreelanceServicesView.as_view(), name='my-services'),
]
