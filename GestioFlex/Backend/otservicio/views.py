from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend

from .models import OTServicio
from .serializers import OTServicioSerializer


class IsAuthenticated(permissions.IsAuthenticated):
    pass

class OTServicioViewSet(viewsets.ModelViewSet):
    queryset = OTServicio.objects.select_related("ot", "servicio").all()
    serializer_class = OTServicioSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["ot", "servicio"]
    ordering_fields = ["id"]
    ordering = ["id"]