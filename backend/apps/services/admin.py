from django.contrib import admin
from .models import ServiceCategory, FreelanceService


@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'icon')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(FreelanceService)
class FreelanceServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'provider', 'category', 'pricing_type', 'price', 'location', 'is_active', 'is_featured')
    list_filter = ('is_active', 'is_featured', 'pricing_type', 'category')
    search_fields = ('title', 'description', 'provider__username', 'skills')
    prepopulated_fields = {'slug': ('title',)}
