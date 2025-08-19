from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OTServicioViewSet

app_name = "ot-servicio"

router = DefaultRouter()
router.register(r"ot-servicios", OTServicioViewSet, basename="ot-servicio")

urlpatterns = [
    path("", include(router.urls)),
]
