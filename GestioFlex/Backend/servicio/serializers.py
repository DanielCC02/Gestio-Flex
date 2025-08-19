from django.db import transaction
from rest_framework import serializers
from .models import Servicio
from insumoservicio.models import InsumoServicio
from insumo.models import Insumo

class InsumoServicioSerializer(serializers.ModelSerializer):
    insumo_nombre = serializers.CharField(source="insumo.nombre", read_only=True)

    class Meta:
        model = InsumoServicio
        fields = ["id", "servicio", "insumo", "insumo_nombre", "cantidad", "notas"]
        read_only_fields = ["id", "insumo_nombre", "servicio"]


class ServicioSerializer(serializers.ModelSerializer):
    estado_display = serializers.CharField(source="get_estado_display", read_only=True)

    # modo 1: sincronizar por lista de objetos {insumo, cantidad, notas}
    insumos_detalle = InsumoServicioSerializer(source="insumo_items", many=True, required=False)

    # modo 2: atajo por IDs simples (sin cantidades). opcional
    insumos_ids = serializers.ListField(
        child=serializers.IntegerField(min_value=1),
        required=False,
        allow_empty=True,
        help_text="IDs de insumos a asociar al servicio con cantidad=1 por defecto."
    )

    class Meta:
        model = Servicio
        fields = [
            "id",
            "estado", "estado_display",
            "nombre", "descripcion",
            "fecha_creacion", "ultima_actualizacion",
            "insumos_detalle", "insumos_ids",
        ]
        read_only_fields = ["id", "fecha_creacion", "ultima_actualizacion", "estado_display"]

    def _sync_insumos_detalle(self, servicio: Servicio, detalle):
        # Reemplazo total del set cuando se envía insumos_detalle
        ids_enviados = set()
        for item in detalle:
            insumo = item["insumo"]
            cantidad = item.get("cantidad", 1)
            notas = item.get("notas", "")
            ids_enviados.add(insumo.id)
            InsumoServicio.objects.update_or_create(
                servicio=servicio, insumo=insumo,
                defaults={"cantidad": cantidad, "notas": notas}
            )
        # eliminar los no enviados
        InsumoServicio.objects.filter(servicio=servicio).exclude(insumo_id__in=ids_enviados).delete()

    def _sync_insumos_ids(self, servicio: Servicio, ids):
        actuales = set(InsumoServicio.objects.filter(servicio=servicio).values_list("insumo_id", flat=True))
        deseados = set(Insumo.objects.filter(id__in=ids).values_list("id", flat=True))
        agregar = deseados - actuales
        quitar  = actuales - deseados
        if quitar:
            InsumoServicio.objects.filter(servicio=servicio, insumo_id__in=quitar).delete()
        InsumoServicio.objects.bulk_create(
            [InsumoServicio(servicio=servicio, insumo_id=i, cantidad=1) for i in agregar],
            ignore_conflicts=True
        )

    @transaction.atomic
    def create(self, validated_data):
        detalle = validated_data.pop("insumo_items", None)  # por insumos_detalle
        ids = validated_data.pop("insumos_ids", None)
        servicio = Servicio.objects.create(**validated_data)
        if detalle is not None:
            self._sync_insumos_detalle(servicio, detalle)
        elif ids is not None:
            self._sync_insumos_ids(servicio, ids)
        return servicio

    @transaction.atomic
    def update(self, instance, validated_data):
        detalle = validated_data.pop("insumo_items", None)
        ids = validated_data.pop("insumos_ids", None)
        for k, v in validated_data.items():
            setattr(instance, k, v)
        instance.save()
        if detalle is not None:
            self._sync_insumos_detalle(instance, detalle)
        if ids is not None:
            self._sync_insumos_ids(instance, ids)
        return instance
