from rest_framework import serializers
from .models import OTUsuario

class OTUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = OTUsuario
        fields = ["id", "ot", "usuario"]
        read_only_fields = ["id"]