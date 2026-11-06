from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    CheremoSphere Unified User Model.
    Supports multi-role membership under a single user account.
    """
    phone = models.CharField(max_length=25, blank=True, default='')
    whatsapp_number = models.CharField(max_length=25, blank=True, default='')
    headline = models.CharField(max_length=200, blank=True, default='')
    bio = models.TextField(blank=True, default='')
    location = models.CharField(max_length=150, default='Nairobi, Kenya', blank=True)
    company_name = models.CharField(max_length=150, blank=True, default='')
    website = models.URLField(blank=True, default='')
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    skills = models.JSONField(default=list, blank=True)
    cv_file = models.FileField(upload_to='cvs/', blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    
    # Role flags (a single user can operate in multiple roles)
    is_job_seeker = models.BooleanField(default=True)
    is_employer = models.BooleanField(default=False)
    is_recruiter = models.BooleanField(default=False)
    is_freelancer = models.BooleanField(default=False)
    is_business_owner = models.BooleanField(default=False)
    is_seller = models.BooleanField(default=False)
    is_customer = models.BooleanField(default=True)
    is_moderator = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        full_name = self.get_full_name().strip()
        return full_name if full_name else self.username

    @property
    def active_roles(self):
        roles = []
        if self.is_job_seeker: roles.append('Job Seeker')
        if self.is_employer: roles.append('Employer')
        if self.is_recruiter: roles.append('Recruiter')
        if self.is_freelancer: roles.append('Freelancer')
        if self.is_business_owner: roles.append('Business Owner')
        if self.is_seller: roles.append('Seller')
        if self.is_customer: roles.append('Customer')
        if self.is_staff or self.is_superuser: roles.append('Administrator')
        if self.is_moderator: roles.append('Moderator')
        return roles
