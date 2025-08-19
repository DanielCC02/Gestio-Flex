from django.db import models

class OTServicio(models.Model):
    ot       = models.ForeignKey("ot.OT", on_delete=models.CASCADE, related_name="ot_servicios")      # <- string ref
    servicio = models.ForeignKey("servicio.Servicio", on_delete=models.PROTECT, related_name="ot_servicios")

    class Meta:
        unique_together = ("ot","servicio")
        constraints = [models.UniqueConstraint(fields=["ot","servicio"], name="uq_ot_servicio")]
        indexes = [models.Index(fields=["ot"]), models.Index(fields=["servicio"]), models.Index(fields=["ot","servicio"])]

    def __str__(self):
        return f"{self.servicio} en {self.ot}"
