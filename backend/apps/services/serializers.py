from rest_framework import serializers
from .models import ServiceCategory, FreelanceService
from accounts.serializers import UserSerializer


class ServiceCategorySerializer(serializers.ModelSerializer):
    services_count = serializers.IntegerField(source='services.count', read_only=True)

    class Meta:
        model = ServiceCategory
        fields = ['id', 'name', 'slug', 'icon', 'services_count']


class FreelanceServiceSerializer(serializers.ModelSerializer):
    provider = UserSerializer(read_only=True)
    category_name = serializers.ReadOnlyField(source='category.name')

    class Meta:
        model = FreelanceService
        fields = [
            'id', 'provider', 'title', 'slug', 'category', 'category_name',
            'description', 'skills', 'pricing_type', 'price', 'currency',
            'location', 'availability', 'cover_image', 'portfolio_links',
            'is_active', 'is_featured', 'rating', 'reviews_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'provider', 'rating', 'reviews_count', 'created_at', 'updated_at']


class FreelanceServiceCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FreelanceService
        fields = [
            'id', 'title', 'category', 'description', 'skills',
            'pricing_type', 'price', 'currency', 'location',
            'availability', 'cover_image', 'portfolio_links'
        ]
