from django.db import models
from django.conf import settings


class JobRequest(models.Model):
    """
    Dedicated reverse job-seeking section: "Ask for a Job".
    Job seekers broadcast what job they are seeking, allowing employers and clients
    to discover candidates directly and contact them.
    """
    EMPLOYMENT_TYPES = [
        ('full_time', 'Full-time'),
        ('part_time', 'Part-time'),
        ('contract', 'Contract'),
        ('freelance', 'Freelance / Gig'),
        ('internship', 'Internship'),
        ('any', 'Any / Open to options'),
    ]

    AVAILABILITY_CHOICES = [
        ('immediately', 'Immediately'),
        ('two_weeks', 'Within 2 Weeks'),
        ('one_month', 'Within 1 Month'),
        ('negotiable', 'Negotiable'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='job_requests')
    job_sought = models.CharField(max_length=200, help_text="e.g. Accounting Job, Driver, Graphic Designer")
    category = models.CharField(max_length=100, default='General')
    personal_introduction = models.TextField(help_text="Introduce yourself and your goals")
    skills = models.CharField(max_length=300, help_text="Key skills separated by commas")
    experience_summary = models.TextField(help_text="Summary of professional background and past work")
    qualifications = models.TextField(help_text="Educational background, diplomas, certificates")
    preferred_location = models.CharField(max_length=150, default='Nairobi, Kenya')
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPES, default='full_time')
    availability = models.CharField(max_length=20, choices=AVAILABILITY_CHOICES, default='immediately')
    expected_salary = models.CharField(max_length=100, blank=True, default='', help_text="e.g. KES 45,000 / month or Negotiable")
    portfolio_url = models.URLField(blank=True, default='')
    cv_file = models.FileField(upload_to='cvs/job_requests/', blank=True, null=True)
    is_fulfilled = models.BooleanField(default=False, help_text="Mark fulfilled once the user lands the job")
    is_active = models.BooleanField(default=True)
    views_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.job_sought} requested by {self.user}"
