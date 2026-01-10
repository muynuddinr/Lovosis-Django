from django.db import models
from django.utils.text import slugify
from django.core.exceptions import ValidationError


# ------------------------
# PARENT CATEGORY
# ------------------------
class ParentCategory(models.Model):
    title = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(unique=True, blank=True)
    image = models.ImageField(upload_to="parent_categories/")
    description = models.TextField(blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


# ------------------------
# CATEGORY
# ------------------------
class Category(models.Model):
    parent_category = models.ForeignKey(
        ParentCategory,
        on_delete=models.CASCADE,
        related_name="categories"
    )
    title = models.CharField(max_length=200)
    slug = models.SlugField(blank=True)
    image = models.ImageField(upload_to="categories/")
    description = models.TextField(blank=True)

    class Meta:
        unique_together = ("parent_category", "title")

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.parent_category} → {self.title}"


# ------------------------
# SUB CATEGORY
# ------------------------
class SubCategory(models.Model):
    parent_category = models.ForeignKey(
        ParentCategory,
        on_delete=models.CASCADE,
        related_name="sub_categories"
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="sub_categories"
    )
    title = models.CharField(max_length=200)
    slug = models.SlugField(blank=True)
    image = models.ImageField(upload_to="sub_categories/")
    description = models.TextField(blank=True)

    class Meta:
        unique_together = ("category", "title")

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.category} → {self.title}"


# ------------------------
# PRODUCT
# ------------------------
class Product(models.Model):
    parent_category = models.ForeignKey(
        ParentCategory,
        on_delete=models.CASCADE,
        related_name="products"
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="products"
    )
    sub_category = models.ForeignKey(
        SubCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="products"
    )

    title = models.CharField(max_length=255)
    slug = models.SlugField(blank=True)
    image = models.ImageField(upload_to="products/")
    image2 = models.ImageField(upload_to="products/", blank=True, null=True)
    image3 = models.ImageField(upload_to="products/", blank=True, null=True)
    catalogs = models.FileField(upload_to="product_catalogs/", blank=True, null=True)
    description = models.TextField()
    key_points = models.TextField(help_text="Write points separated by commas")

    def clean(self):
        """
        VALIDATION LOGIC (IMPORTANT)
        """

        # If category is selected, it must belong to parent category
        if self.category and self.category.parent_category != self.parent_category:
            raise ValidationError("Selected category does not belong to this parent category")

        # If sub category is selected, it must belong to category
        if self.sub_category:
            if not self.category:
                raise ValidationError("Category is required if sub category is selected")
            if self.sub_category.category != self.category:
                raise ValidationError("Selected sub category does not belong to this category")

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        self.full_clean()  # calls clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


# ------------------------
# CATALOG REQUEST
# ------------------------
class CatalogRequest(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    product = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.product}"


# ------------------------
# CONTACT FORM
# ------------------------
class ContactForm(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    business = models.CharField(max_length=255, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    inquiry_type = models.CharField(max_length=100, blank=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.email}"


# ------------------------
# NEWSLETTER SUBSCRIPTION
# ------------------------
class NewsletterSubscription(models.Model):
    email = models.EmailField(unique=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email
