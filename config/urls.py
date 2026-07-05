from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/auth/', include('apps.authentication.urls')),
    path('api/tasks/', include('apps.tasks.urls')),

    # App routes will be added here in later milestones:
    # path('api/annotation/', include('apps.annotation.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)