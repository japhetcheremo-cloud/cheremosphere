from django.db import models
from django.conf import settings
from django.utils.text import slugify


class JobCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    icon = models.CharField(max_length=50, blank=True, default='briefcase')
    description = models.TextField(blank=True, default='')

    class Meta:
        verbose_name_plural = 'Job Categories'
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class JobVacancy(models.Model):
    EMPLOYMENT_TYPES = [
        ('full_time', 'Full-time'),
        ('part_time', 'Part-time'),
        ('contract', 'Contract'),
        ('freelance', 'Freelance'),
        ('internship', 'Internship'),
        ('remote', 'Remote'),
    ]

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('closed', 'Closed'),
        ('draft', 'Draft'),
    ]

    employer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='job_vacancies')
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, blank=True)
    company_name = models.CharField(max_length=150)
    company_logo = models.ImageField(upload_to='company_logos/', blank=True, null=True)
    category = models.ForeignKey(JobCategory, on_delete=models.SET_NULL, null=True, related_name='jobs')
    location = models.CharField(max_length=150, default='Nairobi, Kenya')
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPES, default='full_time')
    experience_level = models.CharField(max_length=100, default='Entry to Mid-Level')
    qualifications = models.TextField(help_text="Required education, certifications, and skills")
    description = models.TextField(help_text="Detailed job description and responsibilities")
    salary_min = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    salary_max = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    is_salary_negotiable = models.BooleanField(default=True)
    currency = models.CharField(max_length=10, default='KES')
    deadline = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='active')
    is_featured = models.BooleanField(default=False)
    views_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(f"{self.company_name}-{self.title}")
            self.slug = base_slug[:200]
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} at {self.company_name}"


class JobApplication(models.Model):
    STATUS_CHOICES = [
        ('submitted', 'Submitted'),
        ('under_review', 'Under Review'),
        ('shortlisted', 'Shortlisted'),
        ('interview', 'Interview'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn'),
    ]

    vacancy = models.ForeignKey(JobVacancy, on_delete=models.CASCADE, related_name='applications')
    applicant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='job_applications')
    cover_letter = models.TextField(blank=True, default='')
    cv_file = models.FileField(upload_to='cvs/applications/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='submitted')
    employer_notes = models.TextField(blank=True, default='')
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('vacancy', 'applicant')
        ordering = ['-applied_at']

    def __str__(self):
        return f"Application by {self.applicant} for {self.vacancy.title}"


class SavedJob(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='saved_jobs')
    vacancy = models.ForeignKey(JobVacancy, on_delete=models.CASCADE, related_name='saved_by_users')
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'vacancy')

    def __str__(self):
        return f"{self.user} saved {self.vacancy}"
