from django.contrib import admin
from .models import Task, Tag


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'status', 'priority', 'due_date', 'created_at')
    list_filter = ('status', 'priority', 'due_date')
    search_fields = ('title', 'description')
    filter_horizontal = ('tags',)
    ordering = ('-created_at',)