from rest_framework import serializers
from .models import Insumo

class InsumoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Insumo
        fields = [
            "id",
            "activo",
            "nombre", "descripcion",
            "unidad_medida",
            "stock_actual", "stock_minimo",
            "precio_unitario",
            "fecha_creacion", "ultima_actualizacion",
        ]
        read_only_fields = ["id", "fecha_creacion", "ultima_actualizacion"]
