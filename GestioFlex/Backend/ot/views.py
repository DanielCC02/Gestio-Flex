from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend

from .models import OT
from .serializers import OTSerializer
from .filters import OTFilter


class OTViewSet(viewsets.ModelViewSet):
    # Prefetch M2M para que el serializer pueda armar servicio_principal y usuarios_nombres
    queryset = (
        OT.objects.all()
        .prefetch_related("usuarios", "servicios")
        .order_by("id")  # ID ascendente: 1,2,3...
    )
    serializer_class = OTSerializer

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = OTFilter
    search_fields = ["titulo", "descripcion", "notas"]
    ordering_fields = ["id", "titulo", "estado", "fecha_inicio", "fecha_finalizacion", "fecha_creacion"]
    ordering = ["id"]  # por defecto ascendente