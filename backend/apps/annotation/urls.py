from rest_framework_nested import routers
from .views import ImageViewSet, ImageTagViewSet, AnnotationViewSet

router = routers.DefaultRouter()
router.register(r'images', ImageViewSet, basename='image')
router.register(r'tags', ImageTagViewSet, basename='imagetag')

# Nested router: /images/<image_pk>/annotations/
images_router = routers.NestedDefaultRouter(router, r'images', lookup='image')
images_router.register(r'annotations', AnnotationViewSet, basename='image-annotations')

urlpatterns = router.urls + images_router.urls