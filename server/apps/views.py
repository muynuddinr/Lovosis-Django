from rest_framework import viewsets
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import FilterSet, CharFilter, BooleanFilter
from django.http import HttpResponse
from django.conf import settings
from django.views.decorators.cache import never_cache
from django.views.decorators.clickjacking import xframe_options_exempt
from django.utils.decorators import method_decorator
from django.views import View
import os

from .models import ParentCategory, Category, SubCategory, Product, CatalogRequest, ContactForm, NewsletterSubscription
from .serializers import (
    ParentCategorySerializer,
    CategorySerializer,
    SubCategorySerializer,
    ProductSerializer,
    CatalogRequestSerializer,
    ContactFormSerializer,
    NewsletterSubscriptionSerializer
)


# ------------------------
# PARENT CATEGORY API
# ------------------------
class ParentCategoryViewSet(viewsets.ModelViewSet):
    queryset = ParentCategory.objects.all()
    serializer_class = ParentCategorySerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ["slug"]
    search_fields = ["title"]


# ------------------------
# CATEGORY API
# ------------------------
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ["parent_category", "parent_category__slug", "slug"]
    search_fields = ["title"]


# ------------------------
# SUB CATEGORY API
# ------------------------
class SubCategoryViewSet(viewsets.ModelViewSet):
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = [
        "parent_category",
        "category",
        "category__slug",
        "parent_category__slug",
        "slug"
    ]
    search_fields = ["title"]


# ------------------------
# PRODUCT FILTER (FIXED)
# ------------------------
class ProductFilter(FilterSet):
    # Filter by parent, category, subcategory slugs
    parent_category__slug = CharFilter(
        field_name="parent_category__slug", lookup_expr="iexact")
    category__slug = CharFilter(
        field_name="category__slug", lookup_expr="iexact")
    sub_category__slug = CharFilter(
        field_name="sub_category__slug", lookup_expr="iexact")
    slug = CharFilter(field_name="slug", lookup_expr="iexact")

    # Special filters for top-level products
    category__isnull = BooleanFilter(
        field_name='category', lookup_expr='isnull')
    sub_category__isnull = BooleanFilter(
        field_name='sub_category', lookup_expr='isnull')

    class Meta:
        model = Product
        fields = [
            "parent_category__slug",
            "category__slug",
            "sub_category__slug",
            "slug",
            "category__isnull",
            "sub_category__isnull",
        ]


# ------------------------
# PRODUCT API
# ------------------------
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related(
        "parent_category", "category", "sub_category"
    )
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = ProductFilter
    search_fields = ["title", "description"]


# ------------------------
# CATALOG REQUEST API
# ------------------------
class CatalogRequestViewSet(viewsets.ModelViewSet):
    queryset = CatalogRequest.objects.all()
    serializer_class = CatalogRequestSerializer


# ------------------------
# CONTACT FORM API
# ------------------------
class ContactFormViewSet(viewsets.ModelViewSet):
    queryset = ContactForm.objects.all()
    serializer_class = ContactFormSerializer


# ------------------------
# NEWSLETTER SUBSCRIPTION API
# ------------------------
class NewsletterSubscriptionViewSet(viewsets.ModelViewSet):
    queryset = NewsletterSubscription.objects.all()
    serializer_class = NewsletterSubscriptionSerializer


# ------------------------
# PDF INLINE VIEW
# ------------------------
@method_decorator(never_cache, name='dispatch')
@method_decorator(xframe_options_exempt, name='dispatch')
class PDFInlineView(View):
    def get(self, request, filename):
        # Use MEDIA_ROOT to locate the uploaded file
        file_path = os.path.join(settings.MEDIA_ROOT, 'product_catalogs', filename)
        if os.path.exists(file_path):
            with open(file_path, 'rb') as pdf_file:
                response = HttpResponse(pdf_file.read(), content_type='application/pdf')
                # Force inline display
                response['Content-Disposition'] = f'inline; filename="{filename}"'
                # Allow embedding from the frontend origin(s)
                # Remove Django's X-Frame-Options if present and set CSP frame-ancestors
                if 'X-Frame-Options' in response:
                    del response['X-Frame-Options']
                origins = [
                    'http://localhost:3000',
                    'http://127.0.0.1:3000',
                ]
                response['Content-Security-Policy'] = f"frame-ancestors 'self' {' '.join(origins)};"
                return response
        return HttpResponse(status=404)
