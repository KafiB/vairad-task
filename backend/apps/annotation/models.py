import os
from PIL import Image as PILImage
from django.db import models
from django.conf import settings


def image_upload_path(instance, filename):
    """
    Custom upload path so images don't all dump into one flat folder.
    Organizes as: media/annotations/<user_id>/<filename>
    """
    return f'annotations/{instance.owner_id}/{filename}'


class Image(models.Model):
    """
    An uploaded image available for annotation.
    Matches the 'Images' page and 'Annotate' page in the designs —
    tracks file metadata (dimensions, size, format) shown directly
    in the UI, rather than recalculating it on every request.
    """

    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        ANNOTATED = 'annotated', 'Annotated'

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='images',
    )
    file = models.ImageField(upload_to=image_upload_path)
    original_filename = models.CharField(max_length=255)
    width = models.PositiveIntegerField(default=0)
    height = models.PositiveIntegerField(default=0)
    file_size = models.PositiveIntegerField(default=0, help_text='Size in bytes')
    file_format = models.CharField(max_length=10, blank=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['uploaded_at']

    def __str__(self):
        return self.original_filename

    def save(self, *args, **kwargs):
        is_new_file = bool(self.file) and not self.file_size

        if is_new_file:
            self.file_size = self.file.size
            self.original_filename = self.original_filename or self.file.name
            self.file_format = os.path.splitext(self.file.name)[1].lstrip('.').upper()

        super().save(*args, **kwargs)

        # Width/height require actually opening the image with Pillow,
        # which needs the file to exist on disk first — so this runs
        # AFTER the initial save (self.file.path only works post-save).
        if is_new_file and self.width == 0:
            with PILImage.open(self.file.path) as img:
                self.width, self.height = img.size
            super().save(update_fields=['width', 'height'])


class ImageTag(models.Model):
    """
    Lightweight tag scoped to images only — kept separate from
    apps.tasks.Tag intentionally, so the annotation app doesn't
    depend on the tasks app (avoids cross-app coupling).
    """

    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Annotation(models.Model):
    """
    A single polygon drawn on an image (e.g. 'Car', 'Front Wheel').
    One Image can have many Annotations — matches the 'Objects (3)'
    list shown in the design, where each row is one polygon.
    """

    image = models.ForeignKey(
        Image,
        on_delete=models.CASCADE,
        related_name='annotations',
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='annotations',
    )
    label = models.CharField(max_length=100)
    color = models.CharField(max_length=7, default='#6D28D9', help_text='Hex color code')
    points = models.JSONField(
        help_text='Ordered list of [x, y] coordinate pairs forming the polygon',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f'{self.label} on {self.image.original_filename}'


# Many-to-many through a plain field on Image, since tags are
# applied at the image level (not per-annotation), matching the
# "Tags: car, vehicle" section shown on the Image Detail page.
Image.add_to_class('tags', models.ManyToManyField(ImageTag, blank=True, related_name='images'))