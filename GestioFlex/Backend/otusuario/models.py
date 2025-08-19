from django.db import models
from django.conf import settings
from ot.models import OT

class OTUsuario(models.Model):
    ot      = models.ForeignKey(OT, on_delete=models.CASCADE, related_name="ot_usuarios")  # <- string ref
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="ot_usuarios")

    class Meta:
        unique_together = ("ot","usuario")
        constraints = [models.UniqueConstraint(fields=["ot","usuario"], name="uq_ot_usuario")]
        indexes = [models.Index(fields=["ot"]), models.Index(fields=["usuario"]), models.Index(fields=["ot","usuario"])]

    def __str__(self):
        return f"{self.usuario} en {self.ot}"
