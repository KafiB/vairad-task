from django.contrib import admin
from .models import Image, ImageTag, Annotation


@admin.register(ImageTag)
class ImageTagAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


class AnnotationInline(admin.TabularInline):
    """
    Shows annotations directly inside the Image admin page,
    instead of navigating to a separate Annotations list —
    matches how your design shows 'Objects (3)' nested under
    the image being viewed, not as a standalone page.
    """
    model = Annotation
    extra = 0
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ('original_filename', 'owner', 'status', 'width', 'height', 'file_size', 'uploaded_at')
    list_filter = ('status', 'file_format')
    search_fields = ('original_filename',)
    filter_horizontal = ('tags',)
    readonly_fields = ('width', 'height', 'file_size', 'file_format', 'uploaded_at', 'updated_at')
    inlines = [AnnotationInline]


@admin.register(Annotation)
class AnnotationAdmin(admin.ModelAdmin):
    list_display = ('label', 'image', 'created_by', 'color', 'created_at')
    list_filter = ('label',)
    search_fields = ('label',)