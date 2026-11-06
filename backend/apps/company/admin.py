from django.contrib import admin
from .models import CompanyProfile, ModerationReport


@admin.register(CompanyProfile)
class CompanyProfileAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'owner_name', 'phone_number', 'official_email', 'updated_at')


@admin.register(ModerationReport)
class ModerationReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'report_type', 'target_id', 'reporter', 'status', 'created_at')
    list_filter = ('report_type', 'status', 'created_at')
    search_fields = ('reason', 'details', 'reporter__username')
