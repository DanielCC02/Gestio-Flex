from rest_framework import serializers
from .models import InsumoServicio

class InsumoServicioSerializer(serializers.ModelSerializer):
    servicio_nombre = serializers.CharField(source="servicio.nombre", read_only=True)
    insumo_nombre = serializers.CharField(source="insumo.nombre", read_only=True)

    class Meta:
        model = InsumoServicio
        fields = ["id", "servicio", "servicio_nombre", "insumo", "insumo_nombre", "cantidad", "notas"]
        read_only_fields = ["id", "servicio_nombre", "insumo_nombre"]
