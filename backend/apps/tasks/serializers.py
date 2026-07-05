from rest_framework import serializers
from .models import Task, Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('id', 'name')


class TaskSerializer(serializers.ModelSerializer):
    """
    Handles both reading and writing tasks.
    Tags are accepted as a list of tag names (not IDs) on write,
    since the frontend Kanban board deals with tag names directly
    (e.g. "Design", "Backend") rather than needing to know DB IDs.
    """

    tags = serializers.ListField(
        child=serializers.CharField(max_length=50),
        write_only=True,
        required=False,
    )
    tag_details = TagSerializer(source='tags', many=True, read_only=True)
    owner = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Task
        fields = (
            'id', 'owner', 'title', 'description', 'status', 'priority',
            'due_date', 'tags', 'tag_details', 'created_at', 'updated_at',
        )

    def create(self, validated_data):
        tag_names = validated_data.pop('tags', [])
        validated_data['owner'] = self.context['request'].user
        task = Task.objects.create(**validated_data)
        self._set_tags(task, tag_names)
        return task

    def update(self, instance, validated_data):
        tag_names = validated_data.pop('tags', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if tag_names is not None:
            self._set_tags(instance, tag_names)

        return instance

    def _set_tags(self, task, tag_names):
        tags = []
        for name in tag_names:
            tag, _ = Tag.objects.get_or_create(name=name.strip())
            tags.append(tag)
        task.tags.set(tags)