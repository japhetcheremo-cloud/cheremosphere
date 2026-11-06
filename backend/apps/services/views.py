from rest_framework import generics, permissions
from django.db.models import Q
from .models import ServiceCategory, FreelanceService
from .serializers import (
    ServiceCategorySerializer, FreelanceServiceSerializer, FreelanceServiceCreateSerializer
)


class ServiceCategoryListView(generics.ListAPIView):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer
    permission_classes = [permissions.AllowAny]


class FreelanceServiceListView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return FreelanceServiceCreateSerializer
        return FreelanceServiceSerializer

    def get_queryset(self):
        queryset = FreelanceService.objects.filter(is_active=True).select_related('provider', 'category')
        search = self.request.query_params.get('search', '').strip()
        category_id = self.request.query_params.get('category', '').strip()
        location = self.request.query_params.get('location', '').strip()

        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(skills__icontains=search) |
                Q(provider__first_name__icontains=search) |
                Q(provider__last_name__icontains=search)
            )
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        if location:
            queryset = queryset.filter(location__icontains=location)

        return queryset

    def perform_create(self, serializer):
        user = self.request.user
        if not user.is_freelancer:
            user.is_freelancer = True
            user.save()
        serializer.save(provider=user)


class FreelanceServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FreelanceService.objects.all()
    serializer_class = FreelanceServiceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_update(self, serializer):
        if self.request.user != self.get_object().provider and not self.request.user.is_staff:
            raise permissions.PermissionDenied("You can only edit your own services.")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user != instance.provider and not self.request.user.is_staff:
            raise permissions.PermissionDenied("You can only delete your own services.")
        instance.delete()


class MyFreelanceServicesView(generics.ListAPIView):
    serializer_class = FreelanceServiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FreelanceService.objects.filter(provider=self.request.user).order_by('-created_at')
