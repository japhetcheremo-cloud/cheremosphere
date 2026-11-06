"""
CheremoSphere Unified Backend URLs.
Maps API endpoints across accounts, company, jobs, job_requests, services,
marketplace, networking, chat, and notifications.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Customize Admin Site Headers with CheremoSphere Branding
admin.site.site_header = "CheremoSphere Administration"
admin.site.site_title = "CheremoSphere Portal"
admin.site.index_title = "CheremoSphere Management & Moderation"

urlpatterns = [
    path('admin/', admin.site.urls),

    # REST API endpoints
    path('api/', include('accounts.urls')),
    path('api/', include('company.urls')),
    path('api/jobs/', include('jobs.urls')),
    path('api/job-seeking/', include('job_requests.urls')),
    path('api/freelance/', include('services.urls')),
    path('api/marketplace/', include('marketplace.urls')),
    path('api/network/', include('networking.urls')),
    path('api/chat/', include('chat.urls')),
    path('api/', include('notifications.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
