from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InsumoViewSet

app_name = "insumo"

router = DefaultRouter()
router.register(r"api", InsumoViewSet, basename="insumo")  # prefijo 'api'

urlpatterns = [
    path("", include(router.urls)),  # URL base: /insumos/api/
]
