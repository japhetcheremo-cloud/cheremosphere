from django.contrib import admin
from .models import JobRequest


@admin.register(JobRequest)
class JobRequestAdmin(admin.ModelAdmin):
    list_display = ('job_sought', 'user', 'category', 'preferred_location', 'employment_type', 'is_fulfilled', 'created_at')
    list_filter = ('is_fulfilled', 'employment_type', 'category', 'availability')
    search_fields = ('job_sought', 'skills', 'user__username', 'preferred_location')
