from rest_framework import generics, permissions
from django.db.models import Q
from .models import ProductCategory, ProductListing, ProductImage, BusinessProfile
from .serializers import (
    ProductCategorySerializer, ProductListingSerializer,
    ProductListingCreateSerializer, BusinessProfileSerializer
)


class ProductCategoryListView(generics.ListAPIView):
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer
    permission_classes = [permissions.AllowAny]


class ProductListingListView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProductListingCreateSerializer
        return ProductListingSerializer

    def get_queryset(self):
        queryset = ProductListing.objects.filter(status='active').select_related('seller', 'category', 'business').prefetch_related('images')
        search = self.request.query_params.get('search', '').strip()
        category_id = self.request.query_params.get('category', '').strip()
        location = self.request.query_params.get('location', '').strip()
        min_price = self.request.query_params.get('min_price', '').strip()
        max_price = self.request.query_params.get('max_price', '').strip()
        condition = self.request.query_params.get('condition', '').strip()

        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(seller__username__icontains=search)
            )
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        if location:
            queryset = queryset.filter(location__icontains=location)
        if min_price and min_price.isdigit():
            queryset = queryset.filter(price__gte=int(min_price))
        if max_price and max_price.isdigit():
            queryset = queryset.filter(price__lte=int(max_price))
        if condition:
            queryset = queryset.filter(condition=condition)

        return queryset

    def perform_create(self, serializer):
        user = self.request.user
        if not user.is_seller:
            user.is_seller = True
            user.save()
        serializer.save(seller=user)


class ProductListingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProductListing.objects.all()
    serializer_class = ProductListingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_update(self, serializer):
        if self.request.user != self.get_object().seller and not self.request.user.is_staff:
            raise permissions.PermissionDenied("You can only edit your own product listings.")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user != instance.seller and not self.request.user.is_staff:
            raise permissions.PermissionDenied("You can only delete your own product listings.")
        instance.delete()


class MyProductListingsView(generics.ListAPIView):
    serializer_class = ProductListingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ProductListing.objects.filter(seller=self.request.user).order_by('-created_at')


class BusinessProfileListView(generics.ListCreateAPIView):
    serializer_class = BusinessProfileSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = BusinessProfile.objects.all().select_related('owner')
        search = self.request.query_params.get('search', '').strip()
        category = self.request.query_params.get('category', '').strip()

        if search:
            queryset = queryset.filter(
                Q(business_name__icontains=search) |
                Q(description__icontains=search) |
                Q(physical_location__icontains=search)
            )
        if category:
            queryset = queryset.filter(category__icontains=category)

        return queryset

    def perform_create(self, serializer):
        user = self.request.user
        if not user.is_business_owner:
            user.is_business_owner = True
            user.save()
        serializer.save(owner=user)


class BusinessProfileDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BusinessProfile.objects.all()
    serializer_class = BusinessProfileSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_update(self, serializer):
        if self.request.user != self.get_object().owner and not self.request.user.is_staff:
            raise permissions.PermissionDenied("You can only edit your own business profile.")
        serializer.save()
