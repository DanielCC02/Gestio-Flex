from django.db import models
from django.utils import timezone

# ---------------------------------------------------------------------------
# Utilidades
# ---------------------------------------------------------------------------

class TimeStampedModel(models.Model):
    fecha_creacion = models.DateTimeField(default=timezone.now, editable=False)
    ultima_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class EstadoChoices(models.TextChoices):
    PENDIENTE   = "PE", "Pendiente"
    EN_PROGRESO = "EP", "En progreso"
    COMPLETADO  = "CO", "Completado"
    CANCELADO   = "CA", "Cancelado"


class Servicio(TimeStampedModel):
    estado      = models.CharField(max_length=2, choices=EstadoChoices.choices, default=EstadoChoices.PENDIENTE)
    nombre      = models.CharField(max_length=120, unique=True)
    descripcion = models.TextField(blank=True)

    # Relación M2M hacia insumo.Insumo mediante insumoservicio.InsumoServicio
    insumos = models.ManyToManyField(
        'insumo.Insumo',
        through='insumoservicio.InsumoServicio',
        related_name='servicios',
        blank=True,
    )

    class Meta:
        ordering = ["nombre"]
        indexes = [
            models.Index(fields=["estado"]),
            models.Index(fields=["nombre"]),
        ]
        verbose_name = "Servicio"
        verbose_name_plural = "Servicios"

    def __str__(self):
        return self.nombre
