from django.db import models
from django.conf import settings


class CompanyProfile(models.Model):
    """
    Official CheremoSphere Company Information & Configuration.
    Manageable by administrators in the admin dashboard.
    """
    company_name = models.CharField(max_length=100, default='CheremoSphere')
    owner_name = models.CharField(max_length=100, default='Japhet Cheremo')
    tagline = models.CharField(max_length=255, default='Your skills. Your opportunities. All in one place.')
    brand_slogan = models.CharField(max_length=255, default='Jobs. Connect. Market. Grow.')
    phone_number = models.CharField(max_length=30, default='0719678760')
    international_whatsapp = models.CharField(max_length=30, default='+254719678760')
    official_email = models.EmailField(default='japhetcheremo@gmai.com')
    physical_office = models.CharField(max_length=255, default='Cheremo Plaza, Nairobi Mombasa Road, Kenya.')
    facebook_url = models.URLField(default='https://www.facebook.com/profile.php?id=61564247063691')
    github_username = models.CharField(max_length=100, default='japhetcheremo-cloud')
    github_profile_url = models.URLField(default='https://github.com/japhetcheremo-cloud')
    twitter_x_url = models.URLField(blank=True, default='')
    about_text = models.TextField(default='CheremoSphere is an all-in-one digital platform connecting job seekers, employers, recruiters, freelancers, professional service providers, business owners, sellers, and customers across Kenya, Africa, and internationally.')
    hero_headline = models.CharField(max_length=255, default='Discover Opportunities. Connect with People. Grow Your Future.')
    hero_subheadline = models.TextField(default='Find your next job, hire talented people, promote your business, discover products and connect with opportunities through one powerful platform.')
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Official Company Profile'
        verbose_name_plural = 'Official Company Profiles'

    def __str__(self):
        return f"{self.company_name} ({self.owner_name})"


class ModerationReport(models.Model):
    """
    Moderation and abuse reporting system for safety across the platform.
    """
    REPORT_TYPES = [
        ('job', 'Job Vacancy'),
        ('job_request', 'Job-Seeker Request'),
        ('service', 'Freelance Service'),
        ('product', 'Marketplace Product'),
        ('business', 'Business Profile'),
        ('post', 'Network Post'),
        ('user', 'User Profile'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('investigating', 'Under Investigation'),
        ('resolved', 'Resolved'),
        ('dismissed', 'Dismissed'),
    ]

    reporter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reports_submitted')
    report_type = models.CharField(max_length=20, choices=REPORT_TYPES)
    target_id = models.PositiveIntegerField(help_text="ID of the reported entity")
    reason = models.CharField(max_length=255)
    details = models.TextField(blank=True, default='')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    moderator_notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Report #{self.id} on {self.report_type}:{self.target_id} by {self.reporter}"
