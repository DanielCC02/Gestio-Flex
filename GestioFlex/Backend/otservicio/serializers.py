from rest_framework import serializers
from .models import OTServicio

class OTServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = OTServicio
        fields = ["id", "ot", "servicio"]
        read_only_fields = ["id"]