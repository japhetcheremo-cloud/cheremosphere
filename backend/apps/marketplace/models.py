from django.db import models
from django.conf import settings
from django.utils.text import slugify


class ProductCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    icon = models.CharField(max_length=50, blank=True, default='shopping-bag')
    description = models.TextField(blank=True, default='')

    class Meta:
        verbose_name_plural = 'Product Categories'
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class BusinessProfile(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='businesses')
    business_name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, blank=True)
    tagline = models.CharField(max_length=255, blank=True, default='')
    description = models.TextField()
    category = models.CharField(max_length=100, default='General Business')
    phone = models.CharField(max_length=30)
    whatsapp = models.CharField(max_length=30, blank=True, default='')
    email = models.EmailField(blank=True, default='')
    website = models.URLField(blank=True, default='')
    physical_location = models.CharField(max_length=255, default='Nairobi, Kenya')
    logo = models.ImageField(upload_to='business_logos/', blank=True, null=True)
    banner = models.ImageField(upload_to='business_banners/', blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.business_name)[:200]
        super().save(*args, **kwargs)

    def __str__(self):
        return self.business_name


class ProductListing(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('sold', 'Marked as Sold'),
        ('inactive', 'Inactive'),
    ]
    CONDITION_CHOICES = [
        ('brand_new', 'Brand New'),
        ('like_new', 'Refurbished / Like New'),
        ('used', 'Used'),
    ]

    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='products')
    business = models.ForeignKey(BusinessProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, blank=True)
    category = models.ForeignKey(ProductCategory, on_delete=models.SET_NULL, null=True, related_name='products')
    description = models.TextField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10, default='KES')
    location = models.CharField(max_length=150, default='Nairobi, Kenya')
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, default='brand_new')
    stock_quantity = models.PositiveIntegerField(default=1)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='active')
    is_promoted = models.BooleanField(default=False)
    views_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.seller.username}-{self.title}")[:200]
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} - KES {self.price}"


class ProductImage(models.Model):
    product = models.ForeignKey(ProductListing, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    is_cover = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_cover', 'id']
