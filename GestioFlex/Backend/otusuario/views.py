from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend

from .models import OT
from otusuario.models import OTUsuario
from otusuario.serializers import OTUsuarioSerializer

class IsAuthenticated(permissions.IsAuthenticated):
    pass

class OTUsuarioViewSet(viewsets.ModelViewSet):
    queryset = OTUsuario.objects.select_related("ot", "usuario").all()
    serializer_class = OTUsuarioSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["ot", "usuario"]
    ordering_fields = ["id"]
    ordering = ["id"]