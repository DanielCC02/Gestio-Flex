from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import InsumoServicio
from .serializers import InsumoServicioSerializer

class InsumoServicioViewSet(viewsets.ModelViewSet):
    queryset = InsumoServicio.objects.select_related("servicio", "insumo").all()
    serializer_class = InsumoServicioSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = ["servicio", "insumo"]
    search_fields = ["servicio__nombre", "insumo__nombre", "notas"]
    ordering_fields = ["id", "cantidad"]
    ordering = ["id"]
