from django.db import models

class InsumoServicio(models.Model):
    servicio = models.ForeignKey('servicio.Servicio', on_delete=models.CASCADE, related_name="insumo_items")
    insumo   = models.ForeignKey('insumo.Insumo', on_delete=models.PROTECT, related_name="servicio_items")
    cantidad = models.DecimalField(max_digits=12, decimal_places=2, default=1)  # cantidad requerida del insumo por servicio
    notas    = models.TextField(blank=True)

    class Meta:
        unique_together = ("servicio", "insumo")
        constraints = [
            models.UniqueConstraint(fields=["servicio", "insumo"], name="uq_servicio_insumo"),
        ]
        indexes = [
            models.Index(fields=["servicio"]),
            models.Index(fields=["insumo"]),
            models.Index(fields=["servicio", "insumo"]),
        ]
        verbose_name = "Insumo – Servicio"
        verbose_name_plural = "Insumos – Servicio"

    def __str__(self):
        return f"{self.insumo} x {self.cantidad} para {self.servicio}"
