from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LoginView, 
    VerifyTokenView, 
    ProtectedView, 
    CustomUserViewSet,
    ListAllUsersView
)

# Enrutador del ViewSet de CustomUser
router = DefaultRouter()
router.register(r'api', CustomUserViewSet, basename='usuario')

urlpatterns = [
    # ViewSet CRUD de usuarios
    path('', include(router.urls)),

    # Listar todos los usuarios
    path('all/', ListAllUsersView.as_view(), name='all'),

    # Login
    path('login/', LoginView.as_view(), name='login'),

    # Valida un token JWT
    path('token/verify/', VerifyTokenView.as_view(), name='token-verify'),

    # Verificar si el token permite acceso a vistas protegidas
    path('protected/', ProtectedView.as_view(), name='protected-view'),
]
