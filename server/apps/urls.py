from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ParentCategoryViewSet,
    CategoryViewSet,
    SubCategoryViewSet,
    ProductViewSet,
    CatalogRequestViewSet,
    ContactFormViewSet,
    NewsletterSubscriptionViewSet,
    PDFInlineView
)

router = DefaultRouter()
router.register("parent-categories", ParentCategoryViewSet)
router.register("categories", CategoryViewSet)
router.register("sub-categories", SubCategoryViewSet)
router.register("products", ProductViewSet)
router.register("catalog-requests", CatalogRequestViewSet)
router.register("contact-forms", ContactFormViewSet)
router.register("newsletter-subscriptions", NewsletterSubscriptionViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("pdf/<str:filename>/", PDFInlineView.as_view(), name="pdf_inline"),
]
