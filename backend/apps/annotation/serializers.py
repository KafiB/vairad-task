from rest_framework import serializers
from .models import Image, ImageTag, Annotation


class ImageTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageTag
        fields = ('id', 'name')


class AnnotationSerializer(serializers.ModelSerializer):
    """
    Handles individual polygon objects on an image.
    'points' is validated as a list of [x, y] pairs — matches
    the freeform polygon drawing shown in the Annotate page design.
    """

    created_by = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Annotation
        fields = (
            'id', 'image', 'label', 'color', 'points',
            'created_by', 'created_at', 'updated_at',
        )
        read_only_fields = ('image',)  # set explicitly in the view, not client-controlled

    def validate_points(self, value):
        if not isinstance(value, list) or len(value) < 3:
            raise serializers.ValidationError(
                'A polygon must have at least 3 points.'
            )
        for point in value:
            if (
                not isinstance(point, (list, tuple))
                or len(point) != 2
                or not all(isinstance(coord, (int, float)) for coord in point)
            ):
                raise serializers.ValidationError(
                    'Each point must be a [x, y] pair of numbers.'
                )
        return value

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return Annotation.objects.create(**validated_data)


class ImageSerializer(serializers.ModelSerializer):
    """
    Full image representation including nested annotations —
    matches the design's 'Annotations (12)' tab showing all
    polygons for the currently open image in one response,
    avoiding an extra round-trip API call.
    """

    annotations = AnnotationSerializer(many=True, read_only=True)
    tag_details = ImageTagSerializer(source='tags', many=True, read_only=True)
    tags = serializers.ListField(
        child=serializers.CharField(max_length=50),
        write_only=True,
        required=False,
    )
    owner = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Image
        fields = (
            'id', 'owner', 'file', 'original_filename', 'width', 'height',
            'file_size', 'file_format', 'status', 'tags', 'tag_details',
            'annotations', 'uploaded_at', 'updated_at',
        )
        read_only_fields = (
            'width', 'height', 'file_size', 'file_format', 'status',
        )

    def create(self, validated_data):
        tag_names = validated_data.pop('tags', [])
        validated_data['owner'] = self.context['request'].user
        image = Image.objects.create(**validated_data)
        self._set_tags(image, tag_names)
        return image

    def update(self, instance, validated_data):
        tag_names = validated_data.pop('tags', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if tag_names is not None:
            self._set_tags(instance, tag_names)

        return instance

    def _set_tags(self, image, tag_names):
        tags = []
        for name in tag_names:
            tag, _ = ImageTag.objects.get_or_create(name=name.strip())
            tags.append(tag)
        image.tags.set(tags)


class ImageListSerializer(serializers.ModelSerializer):


    """
    Lightweight version for the thumbnail strip / image grid —
    matches the 'Images' page and the filmstrip at the bottom of
    the Annotate page, which only need thumbnails + basic status,
    not the full nested annotation list (avoids over-fetching).
    """

    annotation_count = serializers.IntegerField(source='annotations.count', read_only=True)

    class Meta:
        model = Image
        fields = (
            'id', 'file', 'original_filename', 'status', 'width', 'height',
            'file_size', 'uploaded_at', 'annotation_count',
        )