from django.db import models
from django.conf import settings
from django.utils.text import slugify


class ServiceCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    icon = models.CharField(max_length=50, blank=True, default='tool')

    class Meta:
        verbose_name_plural = 'Service Categories'
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class FreelanceService(models.Model):
    PRICING_TYPES = [
        ('fixed', 'Fixed Price'),
        ('hourly', 'Hourly Rate'),
        ('starting_at', 'Starting At'),
        ('contact_for_quote', 'Contact for Quote'),
    ]

    provider = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='freelance_services')
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, blank=True)
    category = models.ForeignKey(ServiceCategory, on_delete=models.SET_NULL, null=True, related_name='services')
    description = models.TextField()
    skills = models.CharField(max_length=300, help_text="Comma-separated skills")
    pricing_type = models.CharField(max_length=25, choices=PRICING_TYPES, default='starting_at')
    price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=10, default='KES')
    location = models.CharField(max_length=150, default='Nairobi, Kenya')
    availability = models.CharField(max_length=100, default='Available for Hire')
    cover_image = models.ImageField(upload_to='service_covers/', blank=True, null=True)
    portfolio_links = models.JSONField(default=list, blank=True)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=5.0)
    reviews_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.provider.username}-{self.title}")[:200]
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} by {self.provider}"
