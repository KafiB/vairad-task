from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Task, Tag
from .serializers import TaskSerializer, TagSerializer


class TaskViewSet(viewsets.ModelViewSet):
    """
    Provides list, create, retrieve, update, partial_update, destroy
    for tasks — all scoped to the logged-in user's own tasks only.

    Supports:
      GET /api/tasks/?due_date=2025-05-21   (filter by date, for the Kanban board)
      GET /api/tasks/?status=todo           (filter by column)
      GET /api/tasks/?priority=high         (filter by priority)
    """

    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['due_date', 'status', 'priority']

    def get_queryset(self):
        # Only ever return tasks owned by the requesting user —
        # never expose other users' tasks, regardless of query params.
        return Task.objects.filter(owner=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class TagViewSet(viewsets.ModelViewSet):
    """
    Provides list/create/retrieve/update/destroy for tags.
    Tags are shared across all users (not per-user), matching
    the "Design, Frontend, Backend, Bug, Docs" style shared legend
    shown in the Kanban board design.
    """

    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticated]