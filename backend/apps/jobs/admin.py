from django.contrib import admin
from .models import JobCategory, JobVacancy, JobApplication, SavedJob


@admin.register(JobCategory)
class JobCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'icon')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(JobVacancy)
class JobVacancyAdmin(admin.ModelAdmin):
    list_display = ('title', 'company_name', 'employer', 'location', 'employment_type', 'status', 'is_featured', 'created_at')
    list_filter = ('status', 'employment_type', 'is_featured', 'category')
    search_fields = ('title', 'company_name', 'description', 'location')
    prepopulated_fields = {'slug': ('title',)}


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ('id', 'vacancy', 'applicant', 'status', 'applied_at')
    list_filter = ('status', 'applied_at')
    search_fields = ('applicant__username', 'vacancy__title', 'vacancy__company_name')


@admin.register(SavedJob)
class SavedJobAdmin(admin.ModelAdmin):
    list_display = ('user', 'vacancy', 'saved_at')
