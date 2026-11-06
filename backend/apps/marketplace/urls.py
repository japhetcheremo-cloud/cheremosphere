from django.urls import path
from .views import (
    ProductCategoryListView, ProductListingListView,
    ProductListingDetailView, MyProductListingsView,
    BusinessProfileListView, BusinessProfileDetailView
)

urlpatterns = [
    path('categories/', ProductCategoryListView.as_view(), name='product-categories'),
    path('products/', ProductListingListView.as_view(), name='product-list'),
    path('products/<int:pk>/', ProductListingDetailView.as_view(), name='product-detail'),
    path('products/my/', MyProductListingsView.as_view(), name='my-products'),
    path('businesses/', BusinessProfileListView.as_view(), name='business-list'),
    path('businesses/<int:pk>/', BusinessProfileDetailView.as_view(), name='business-detail'),
]
