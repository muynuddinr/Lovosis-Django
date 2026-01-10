from django.contrib import admin
from .models import ParentCategory, Category, SubCategory, Product, CatalogRequest, ContactForm, NewsletterSubscription


@admin.register(ParentCategory)
class ParentCategoryAdmin(admin.ModelAdmin):
    list_display = ("title", "slug")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title",)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("title", "parent_category")
    list_filter = ("parent_category",)
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title",)


@admin.register(SubCategory)
class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "parent_category")
    list_filter = ("parent_category", "category")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title",)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("title", "parent_category", "category", "sub_category")
    list_filter = ("parent_category", "category", "sub_category")
    search_fields = ("title",)
    readonly_fields = ("slug",)


@admin.register(CatalogRequest)
class CatalogRequestAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "phone", "product", "created_at")
    list_filter = ("created_at",)
    search_fields = ("name", "email", "product")
    readonly_fields = ("created_at",)


@admin.register(ContactForm)
class ContactFormAdmin(admin.ModelAdmin):
    list_display = ("first_name", "last_name", "email", "phone", "created_at")
    list_filter = ("created_at",)
    search_fields = ("first_name", "last_name", "email")
    readonly_fields = ("created_at",)


@admin.register(NewsletterSubscription)
class NewsletterSubscriptionAdmin(admin.ModelAdmin):
    list_display = ("email", "subscribed_at")
    list_filter = ("subscribed_at",)
    search_fields = ("email",)
    readonly_fields = ("subscribed_at",)
