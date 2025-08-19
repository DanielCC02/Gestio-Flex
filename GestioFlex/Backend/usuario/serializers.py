from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth import authenticate, get_user_model

User = get_user_model()

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'password', 'email', 'first_name', 'last_name', 'rol', 'google_user_id']
        # Para actualizaciones parciales:
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
            'username': {'required': False},
            'rol': {'required': False},
            'email': {'required': False},
            'first_name': {'required': False},
            'last_name': {'required': False},
        }
    
    # Sobrescribimos el método create para cifrar la contraseña
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = CustomUser.objects.create_user(**validated_data, password=password)
        return user


    # Sobrescribimos el método update para cifrar la contraseña si es proporcionada
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


# _____________________________________________________________#

# LOGIN

# Serializer minimalista para el login y mejorar rendimiento
class MinimalUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'rol']


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(trim_whitespace=False)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        if username and password:
            user = authenticate(request=self.context.get('request'), username=username, password=password)
            if not user:
                raise serializers.ValidationError("Credenciales incorrectas", code='authorization')
        else:
            raise serializers.ValidationError("Debe incluir 'username' y 'password'", code='authorization')
        data['user'] = user
        return data

# _____________________________________________________________#
