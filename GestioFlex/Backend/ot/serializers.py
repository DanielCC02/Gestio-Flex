from django.db import transaction
from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import OT
from otusuario.models import OTUsuario
from otservicio.models import OTServicio
from servicio.models import Servicio

User = get_user_model()


class OTSerializer(serializers.ModelSerializer):
    # Legible del estado desde el modelo (TextChoices)
    estado_display = serializers.CharField(source="get_estado_display", read_only=True)

    # Campos calculados que usa el listado/detalle
    servicio_principal = serializers.SerializerMethodField(read_only=True)
    usuarios_nombres = serializers.SerializerMethodField(read_only=True)

    # Útil en detalle/edición
    usuarios_ids = serializers.ListField(
        child=serializers.IntegerField(min_value=1),
        required=False,
        allow_empty=True,
        help_text="IDs de usuarios asignados a la OT.",
    )
    servicios_ids = serializers.ListField(
        child=serializers.IntegerField(min_value=1),
        required=False,
        allow_empty=True,
        help_text="IDs de servicios asignados a la OT.",
    )

    class Meta:
        model = OT
        fields = [
            "id",
            "titulo",
            "descripcion",
            "estado",
            "estado_display",
            "fecha_inicio",
            "fecha_finalizacion",
            "notas",
            "fecha_creacion",
            "ultima_actualizacion",

            # calculados para la grilla
            "servicio_principal",
            "usuarios_nombres",

            # ids de M2M (entrada/salida)
            "usuarios_ids",
            "servicios_ids",
        ]
        read_only_fields = [
            "id",
            "fecha_creacion",
            "ultima_actualizacion",
            "estado_display",
            "servicio_principal",
            "usuarios_nombres",
        ]

    # ---------- REPRESENTACIÓN ----------
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        # devolver también los ids actuales (útil para detalle/edición)
        rep["usuarios_ids"] = list(instance.usuarios.values_list("id", flat=True))
        rep["servicios_ids"] = list(instance.servicios.values_list("id", flat=True))
        return rep

    # ---------- HELPERS CALCULADOS ----------
    def get_servicio_principal(self, obj: OT):
        """
        Primer servicio por id como servicio principal.
        """
        s = obj.servicios.order_by("id").first()
        return s.nombre if s else None

    def get_usuarios_nombres(self, obj: OT):
        """
        Lista de nombres bonitos de usuarios asignados.
        Si no tienen nombre/campo, usa username.
        """
        nombres = []
        for u in obj.usuarios.all():
            fn = (getattr(u, "first_name", "") or "").strip()
            ln = (getattr(u, "last_name", "") or "").strip()
            full = f"{fn} {ln}".strip()
            nombres.append(full if full else getattr(u, "username", f"usuario_{u.id}"))
        return nombres

    # ---------- VALIDACIÓN ----------
    def validate(self, attrs):
        fi = attrs.get("fecha_inicio", getattr(self.instance, "fecha_inicio", None))
        ff = attrs.get("fecha_finalizacion", getattr(self.instance, "fecha_finalizacion", None))
        if fi and ff and ff < fi:
            raise serializers.ValidationError(
                {"fecha_finalizacion": "No puede ser menor que fecha_inicio."}
            )
        return attrs

    # ---------- SYNC M2M ----------
    def _sync_m2m(self, ot: OT, usuarios_ids, servicios_ids):
        # Usuarios
        if usuarios_ids is not None:
            valid_user_ids = set(User.objects.filter(id__in=usuarios_ids).values_list("id", flat=True))
            actuales = set(OTUsuario.objects.filter(ot=ot).values_list("usuario_id", flat=True))
            quitar = actuales - valid_user_ids
            nuevos = valid_user_ids - actuales
            if quitar:
                OTUsuario.objects.filter(ot=ot, usuario_id__in=quitar).delete()
            if nuevos:
                OTUsuario.objects.bulk_create(
                    [OTUsuario(ot=ot, usuario_id=uid) for uid in nuevos],
                    ignore_conflicts=True,
                )

        # Servicios
        if servicios_ids is not None:
            valid_serv_ids = set(Servicio.objects.filter(id__in=servicios_ids).values_list("id", flat=True))
            actuales = set(OTServicio.objects.filter(ot=ot).values_list("servicio_id", flat=True))
            quitar = actuales - valid_serv_ids
            nuevos = valid_serv_ids - actuales
            if quitar:
                OTServicio.objects.filter(ot=ot, servicio_id__in=quitar).delete()
            if nuevos:
                OTServicio.objects.bulk_create(
                    [OTServicio(ot=ot, servicio_id=sid) for sid in nuevos],
                    ignore_conflicts=True,
                )

    # ---------- CREATE / UPDATE ----------
    @transaction.atomic
    def create(self, validated_data):
        usuarios_ids = validated_data.pop("usuarios_ids", None)
        servicios_ids = validated_data.pop("servicios_ids", None)
        ot = OT.objects.create(**validated_data)
        self._sync_m2m(ot, usuarios_ids, servicios_ids)
        return ot

    @transaction.atomic
    def update(self, instance, validated_data):
        usuarios_ids = validated_data.pop("usuarios_ids", None)
        servicios_ids = validated_data.pop("servicios_ids", None)
        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        instance.save()
        self._sync_m2m(instance, usuarios_ids, servicios_ids)
        return instance