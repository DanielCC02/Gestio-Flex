import django_filters
from .models import OT, EstadoChoices


class OTFilter(django_filters.FilterSet):
    fecha_inicio_desde = django_filters.DateFilter(field_name="fecha_inicio", lookup_expr="gte")
    fecha_inicio_hasta = django_filters.DateFilter(field_name="fecha_inicio", lookup_expr="lte")
    fecha_finalizacion_desde = django_filters.DateFilter(field_name="fecha_finalizacion", lookup_expr="gte")
    fecha_finalizacion_hasta = django_filters.DateFilter(field_name="fecha_finalizacion", lookup_expr="lte")

    class Meta:
        model = OT
        fields = {
            "estado": ["exact"],
        }
