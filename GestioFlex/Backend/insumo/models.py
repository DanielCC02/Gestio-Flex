from django.db import models
from django.conf import settings
from django.utils import timezone

# ---------------------------------------------------------------------------
# Utilidades
# ---------------------------------------------------------------------------

class TimeStampedModel(models.Model):
    """
    Factor común para fecha de creación y última actualización.
    """
    fecha_creacion = models.DateTimeField(default=timezone.now, editable=False)
    ultima_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class Insumo(TimeStampedModel):
    activo          = models.BooleanField(default=True)
    nombre          = models.CharField(max_length=120)
    descripcion     = models.TextField(blank=True)
    unidad_medida   = models.CharField(max_length=20)
    stock_actual    = models.DecimalField(max_digits=10, decimal_places=2)
    stock_minimo    = models.DecimalField(max_digits=10, decimal_places=2)
    precio_unitario = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return self.nombre