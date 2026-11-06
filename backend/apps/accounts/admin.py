from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'phone', 'is_verified', 'is_staff')
    list_filter = ('is_verified', 'is_staff', 'is_job_seeker', 'is_employer', 'is_freelancer', 'is_seller')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'phone')
    fieldsets = BaseUserAdmin.fieldsets + (
        ('CheremoSphere Profile', {
            'fields': (
                'phone', 'whatsapp_number', 'headline', 'bio', 'location',
                'company_name', 'website', 'avatar', 'skills', 'cv_file', 'is_verified'
            )
        }),
        ('User Roles', {
            'fields': (
                'is_job_seeker', 'is_employer', 'is_recruiter',
                'is_freelancer', 'is_business_owner', 'is_seller',
                'is_customer', 'is_moderator'
            )
        }),
    )
