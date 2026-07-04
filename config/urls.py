"""
Root URL configuration.

This is Django's top-level router — equivalent to your main
Express app.js where you do app.use('/api/tasks', tasksRouter).
Each app (authentication, tasks, annotation) will get its own
urls.py, and we'll wire them in here via include() as we build them.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # App routes will be added here in later milestones:
    # path('api/auth/', include('apps.authentication.urls')),
    # path('api/tasks/', include('apps.tasks.urls')),
    # path('api/annotation/', include('apps.annotation.urls')),
]

# Serve uploaded media files (annotation images) during development.
# In production, a proper web server (nginx) or cloud storage (S3)
# handles this instead — Django serving media directly is dev-only.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)