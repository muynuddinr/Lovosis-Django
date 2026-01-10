from rest_framework import serializers
import os
from .models import ParentCategory, Category, SubCategory, Product, CatalogRequest, ContactForm, NewsletterSubscription


# ------------------------
# PARENT CATEGORY
# ------------------------
class ParentCategorySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

    class Meta:
        model = ParentCategory
        fields = "__all__"


# ------------------------
# CATEGORY
# ------------------------
class CategorySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

    parent_category_detail = ParentCategorySerializer(
        source="parent_category", read_only=True
    )

    class Meta:
        model = Category
        fields = "__all__"


# ------------------------
# SUB CATEGORY
# ------------------------
class SubCategorySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

    category_detail = CategorySerializer(
        source="category", read_only=True
    )

    class Meta:
        model = SubCategory
        fields = "__all__"


# ------------------------
# PRODUCT
# ------------------------
class ProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    image2 = serializers.SerializerMethodField()
    image3 = serializers.SerializerMethodField()
    catalogs = serializers.SerializerMethodField()

    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

    def get_image2(self, obj):
        if obj.image2:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image2.url)
            return obj.image2.url
        return None

    def get_image3(self, obj):
        if obj.image3:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image3.url)
            return obj.image3.url
        return None

    def get_catalogs(self, obj):
        if obj.catalogs:
            filename = os.path.basename(obj.catalogs.name)
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(f"/api/pdf/{filename}/")
            return f"/api/pdf/{filename}/"
        return None

    # Detailed nested data
    parent_category_detail = ParentCategorySerializer(
        source="parent_category", read_only=True
    )
    category_detail = CategorySerializer(
        source="category", read_only=True
    )
    sub_category_detail = SubCategorySerializer(
        source="sub_category", read_only=True
    )
    
    # Basic category data for backward compatibility
    parent_category = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField() 
    sub_category = serializers.SerializerMethodField()
    
    def get_parent_category(self, obj):
        if obj.parent_category:
            return {"title": obj.parent_category.title, "slug": obj.parent_category.slug}
        return None
    
    def get_category(self, obj):
        if obj.category:
            return {"title": obj.category.title, "slug": obj.category.slug}
        return None
        
    def get_sub_category(self, obj):
        if obj.sub_category:
            return {"title": obj.sub_category.title, "slug": obj.sub_category.slug}
        return None

    class Meta:
        model = Product
        fields = "__all__"


# ------------------------
# CATALOG REQUEST
# ------------------------
class CatalogRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CatalogRequest
        fields = "__all__"


# ------------------------
# CONTACT FORM
# ------------------------
class ContactFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactForm
        fields = "__all__"


# ------------------------
# NEWSLETTER SUBSCRIPTION
# ------------------------
class NewsletterSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscription
        fields = "__all__"
