from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.hashers import check_password
from .models import CustomUser

class AuthBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            # Buscar solo los campos necesarios para validar el login
            user = CustomUser.objects.only('id', 'password', 'is_active').get(username=username)

            # Verificar la contraseña
            if user.check_password(password) and user.is_active:
                return user
        except CustomUser.DoesNotExist:
            return None