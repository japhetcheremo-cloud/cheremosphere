from django.urls import path
from .views import (
    CompanyProfileView, PlatformStatsView, UniversalSearchView,
    ModerationReportCreateView, ModerationReportListView
)

urlpatterns = [
    path('company/profile/', CompanyProfileView.as_view(), name='company-profile'),
    path('platform/stats/', PlatformStatsView.as_view(), name='platform-stats'),
    path('search/', UniversalSearchView.as_view(), name='universal-search'),
    path('reports/', ModerationReportCreateView.as_view(), name='report-create'),
    path('admin/reports/', ModerationReportListView.as_view(), name='admin-reports-list'),
]
