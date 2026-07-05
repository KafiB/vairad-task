from rest_framework import viewsets, permissions, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action

from .models import Image, ImageTag, Annotation
from .serializers import (
    ImageSerializer,
    ImageListSerializer,
    ImageTagSerializer,
    AnnotationSerializer,
)


class ImageViewSet(viewsets.ModelViewSet):
    """
    Handles image upload, listing (thumbnail strip), and detail
    retrieval (with nested annotations) — scoped to the logged-in
    user's own images only.

    GET    /api/annotation/images/           -> lightweight list
    POST   /api/annotation/images/           -> upload (multipart/form-data)
    GET    /api/annotation/images/<id>/      -> full detail + annotations
    DELETE /api/annotation/images/<id>/      -> delete image + its annotations
    """

    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status']

    def get_queryset(self):
        return Image.objects.filter(owner=self.request.user)

    def get_serializer_class(self):
        if self.action == 'list':
            return ImageListSerializer
        return ImageSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class ImageTagViewSet(viewsets.ModelViewSet):
    """
    Shared tags across all users' images (e.g. "car", "vehicle").
    """
    queryset = ImageTag.objects.all()
    serializer_class = ImageTagSerializer
    permission_classes = [permissions.IsAuthenticated]


class AnnotationViewSet(viewsets.ModelViewSet):
    """
    Handles individual polygon CRUD. Nested under a specific image
    via the URL, since a polygon never exists independently of an
    image — matches the requirement "delete a specific polygon
    without affecting the remaining polygons."

    GET    /api/annotation/images/<image_id>/annotations/        -> list polygons for this image
    POST   /api/annotation/images/<image_id>/annotations/        -> add a new polygon
    PATCH  /api/annotation/images/<image_id>/annotations/<id>/   -> update a polygon (e.g. move points)
    DELETE /api/annotation/images/<image_id>/annotations/<id>/   -> delete ONE polygon only
    """

    serializer_class = AnnotationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only annotations belonging to images the user owns,
        # AND matching the image_id in the URL.
        return Annotation.objects.filter(
            image_id=self.kwargs['image_pk'],
            image__owner=self.request.user,
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        # The image is determined by the URL, never by the client body —
        # same security principle as 'owner' in the Task serializer.
        image = Image.objects.get(pk=self.kwargs['image_pk'], owner=self.request.user)
        serializer.save(image=image)

        # Auto-flip image status to 'annotated' once it has at least one polygon —
        # matches the status badges shown in your Images grid design.
        if image.status != Image.Status.ANNOTATED:
            image.status = Image.Status.ANNOTATED
            image.save(update_fields=['status'])

    def perform_destroy(self, instance):
        image = instance.image
        instance.delete()

        # If that was the last polygon, flip status back to pending.
        if not image.annotations.exists():
            image.status = Image.Status.PENDING
            image.save(update_fields=['status'])

    @action(detail=False, methods=['post'], url_path='bulk-save')
    def bulk_save(self, request, image_pk=None):
        """
        POST /api/annotation/images/<image_pk>/annotations/bulk-save/
        Replaces ALL annotations for this image in one atomic request.
        """
        try:
            image = Image.objects.get(pk=image_pk, owner=request.user)
        except Image.DoesNotExist:
            return Response(
                {'detail': 'Image not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        annotations_data = request.data.get('annotations', [])

        serializer = AnnotationSerializer(
            data=annotations_data, many=True, context={'request': request}
        )
        serializer.is_valid(raise_exception=True)

        image.annotations.all().delete()

        for item in serializer.validated_data:
            Annotation.objects.create(image=image, created_by=request.user, **item)

        image.status = Image.Status.ANNOTATED if annotations_data else Image.Status.PENDING
        image.save(update_fields=['status'])

        return Response(
            AnnotationSerializer(image.annotations.all(), many=True).data,
            status=status.HTTP_200_OK,
        )