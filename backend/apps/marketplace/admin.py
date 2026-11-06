from django.contrib import admin
from .models import ProductCategory, ProductListing, ProductImage, BusinessProfile


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(ProductCategory)
class ProductCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'icon')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(ProductListing)
class ProductListingAdmin(admin.ModelAdmin):
    list_display = ('title', 'seller', 'category', 'price', 'condition', 'status', 'is_promoted', 'created_at')
    list_filter = ('status', 'condition', 'is_promoted', 'category')
    search_fields = ('title', 'description', 'seller__username', 'location')
    inlines = [ProductImageInline]


@admin.register(BusinessProfile)
class BusinessProfileAdmin(admin.ModelAdmin):
    list_display = ('business_name', 'owner', 'category', 'phone', 'is_verified', 'is_featured')
    list_filter = ('is_verified', 'is_featured', 'category')
    search_fields = ('business_name', 'owner__username', 'phone', 'physical_location')
