from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.exceptions import ValidationError
from servicio.models import Servicio


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


class EstadoChoices(models.TextChoices):
    PENDIENTE     = "PE", "Pendiente"
    EN_PROGRESO   = "EP", "En progreso"
    COMPLETADO    = "CO", "Completado"
    CANCELADO     = "CA", "Cancelado"


# ---------------------------------------------------------------------------
# Núcleo OT + tablas intermedias
# ---------------------------------------------------------------------------

class OT(TimeStampedModel):
    estado              = models.CharField(
        max_length=2, choices=EstadoChoices.choices, default=EstadoChoices.PENDIENTE
    )
    titulo              = models.CharField(max_length=150)
    descripcion         = models.TextField(blank=True)
    fecha_inicio        = models.DateField(null=True, blank=True)
    fecha_finalizacion  = models.DateField(null=True, blank=True)
    notas               = models.TextField(blank=True)

    # Relaciones M2M a través de tablas intermedias
    usuarios  = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        through="otusuario.OTUsuario",
        related_name="ots",
        blank=True,
    )
    servicios = models.ManyToManyField(
        "servicio.Servicio",
        through="otservicio.OTServicio",
        related_name="ots",
        blank=True,
    )

    class Meta:
        ordering = ["-fecha_creacion", "-id"]
        indexes = [
            models.Index(fields=["estado"]),
            models.Index(fields=["fecha_inicio", "fecha_finalizacion"]),
            models.Index(fields=["titulo"]),
        ]
        verbose_name = "Orden de trabajo"
        verbose_name_plural = "Órdenes de trabajo"

    def __str__(self):
        return f"OT #{self.id} - {self.titulo}"

    def clean(self):
        if self.fecha_inicio and self.fecha_finalizacion:
            if self.fecha_finalizacion < self.fecha_inicio:
                raise ValidationError({"fecha_finalizacion": "No puede ser menor que fecha_inicio."})

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)