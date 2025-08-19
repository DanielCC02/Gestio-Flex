from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InsumoServicioViewSet

app_name = "insumoservicio"

router = DefaultRouter()
router.register(r"insumo-servicios", InsumoServicioViewSet, basename="insumoservicio")

urlpatterns = [path("", include(router.urls))]
