import django_filters
from .models import Insumo

class InsumoFilter(django_filters.FilterSet):
    nombre = django_filters.CharFilter(field_name="nombre", lookup_expr="icontains")

    class Meta:
        model = Insumo
        fields = {
            "activo": ["exact"],
            "nombre": ["icontains", "exact"],
        }
