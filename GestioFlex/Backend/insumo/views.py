from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Insumo
from .serializers import InsumoSerializer
from .filters import InsumoFilter

class InsumoViewSet(viewsets.ModelViewSet):
    queryset = Insumo.objects.all()  # <- Obligatorio para que funcione list()
    serializer_class = InsumoSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = InsumoFilter
    search_fields = ["nombre", "descripcion", "unidad_medida"]
    ordering_fields = ["nombre", "precio_unitario", "stock_actual", "fecha_creacion"]
    ordering = ["nombre"]
