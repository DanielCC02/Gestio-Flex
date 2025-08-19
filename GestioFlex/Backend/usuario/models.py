from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

class CustomUser(AbstractUser):
    ROLES = [
        ('admin', 'Administrador'),
        ('empleado', 'Empleado'),
        ('jefatura', 'Jefatura'),
    ]

    username = models.CharField(max_length=150, unique=True, db_index=True)

    email = models.EmailField(unique=True)

    rol = models.CharField(max_length=20, choices=ROLES)  

    google_user_id = models.CharField(max_length=255, blank=True, null=True, db_index=True)
    
    def __str__(self):
        return self.username