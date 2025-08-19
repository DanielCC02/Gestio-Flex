from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OTUsuarioViewSet

app_name = "ot"

router = DefaultRouter()
router.register(r"ot-usuarios", OTUsuarioViewSet, basename="ot-usuario")
urlpatterns = [
    path("", include(router.urls)),
]
