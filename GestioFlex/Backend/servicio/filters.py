import django_filters
from .models import Servicio, EstadoChoices

class ServicioFilter(django_filters.FilterSet):
    nombre = django_filters.CharFilter(field_name="nombre", lookup_expr="icontains")

    class Meta:
        model = Servicio
        fields = {
            "estado": ["exact"],
            "nombre": ["icontains", "exact"],
        }
