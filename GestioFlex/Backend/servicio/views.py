from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Servicio
from .serializers import ServicioSerializer
from .filters import ServicioFilter

class ServicioViewSet(viewsets.ModelViewSet):
    queryset = (
        Servicio.objects
        .prefetch_related("insumo_items__insumo")
        .all()
    )
    serializer_class = ServicioSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ServicioFilter
    search_fields = ["nombre", "descripcion", "insumo_items__insumo__nombre"]
    ordering_fields = ["nombre", "fecha_creacion", "ultima_actualizacion"]
    ordering = ["nombre"]
