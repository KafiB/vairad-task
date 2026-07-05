from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


class UserAdmin(BaseUserAdmin):
    """
    Custom admin configuration for our email-based User model.
    Django's default UserAdmin assumes a 'username' field exists,
    so we override the fieldsets to match our actual fields.
    """

    model = User
    list_display = ('email', 'full_name', 'is_staff', 'is_active', 'created_at')
    list_filter = ('is_staff', 'is_active')
    ordering = ('-created_at',)
    search_fields = ('email', 'full_name')

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('full_name',)}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'full_name', 'password1', 'password2', 'is_staff', 'is_active'),
        }),
    )

    filter_horizontal = ('groups', 'user_permissions')


admin.site.register(User, UserAdmin)