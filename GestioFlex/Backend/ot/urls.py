from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OTViewSet

app_name = "ot"

router = DefaultRouter()
router.register(r"ots", OTViewSet, basename="ot")

urlpatterns = [
    path("", include(router.urls)),
]
