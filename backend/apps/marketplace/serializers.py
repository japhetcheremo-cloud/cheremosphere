from rest_framework import serializers
from .models import ProductCategory, ProductListing, ProductImage, BusinessProfile
from accounts.serializers import UserSerializer


class ProductCategorySerializer(serializers.ModelSerializer):
    products_count = serializers.IntegerField(source='products.count', read_only=True)

    class Meta:
        model = ProductCategory
        fields = ['id', 'name', 'slug', 'icon', 'description', 'products_count']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_cover']


class BusinessProfileSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    products_count = serializers.IntegerField(source='products.count', read_only=True)

    class Meta:
        model = BusinessProfile
        fields = [
            'id', 'owner', 'business_name', 'slug', 'tagline', 'description',
            'category', 'phone', 'whatsapp', 'email', 'website',
            'physical_location', 'logo', 'banner', 'is_verified', 'is_featured',
            'products_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'owner', 'is_verified', 'is_featured', 'created_at', 'updated_at']


class ProductListingSerializer(serializers.ModelSerializer):
    seller = UserSerializer(read_only=True)
    business = BusinessProfileSerializer(read_only=True)
    category_name = serializers.ReadOnlyField(source='category.name')
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = ProductListing
        fields = [
            'id', 'seller', 'business', 'title', 'slug', 'category', 'category_name',
            'description', 'price', 'currency', 'location', 'condition',
            'stock_quantity', 'status', 'is_promoted', 'views_count', 'images',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'seller', 'views_count', 'created_at', 'updated_at']


class ProductListingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductListing
        fields = [
            'id', 'business', 'title', 'category', 'description', 'price',
            'currency', 'location', 'condition', 'stock_quantity', 'status'
        ]
