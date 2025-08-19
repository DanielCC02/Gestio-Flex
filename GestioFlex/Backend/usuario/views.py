from django.conf import settings
from .models import CustomUser
from .serializers import LoginSerializer, CustomUserSerializer, MinimalUserSerializer
import requests

from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import action


# VERIFICAR TOKEN

class VerifyTokenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({"error": "Authorization header is missing or invalid"}, status=status.HTTP_400_BAD_REQUEST)

        token = auth_header.split(' ')[1]

        try:
            JWTAuthentication().get_validated_token(token)
            return Response({"message": "Token is valid"}, status=status.HTTP_200_OK)
        except InvalidToken:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
#___________________________________________________________________________________________#

# LOGIN CON CREDENCIALES

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
            
        # Validar credenciales
        serializer = LoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        # Generar nuevos tokens sin usar la caché
        refresh = RefreshToken.for_user(user)
        tokens = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

        # Retornar los tokens y datos del usuario
        response_data = {
            **tokens,
            'id': user.id,
            'username': user.username,
            'rol': user.rol,
        }

        return Response(response_data, status=status.HTTP_200_OK)


#___________________________________________________________________________________________#

# VERIFICAR VISTA PROTEGIDA

class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "You have access to this view!"})
#___________________________________________________________________________________________#

# VIEW CUSTOMUSER

class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return super().get_permissions()

    # Listar Jefes
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def jefes(self, request):
        jefes = CustomUser.objects.filter(rol='admin')
        serializer = self.get_serializer(jefes, many=True)
        return Response(serializer.data)

    # Listar Empleados
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def empleados(self, request):
        empleados = CustomUser.objects.filter(rol='empleado') 
        serializer = self.get_serializer(empleados, many=True)
        return Response(serializer.data)

    
    # Listar usuario de Inventario
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def inventarios(self, request):
        inventarios = CustomUser.objects.filter(rol='inventario')
        serializer = self.get_serializer(inventarios, many=True)
        return Response(serializer.data)

    # Actualización parcial de usuario (PUT / PATCH)
    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)


class ListAllUsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        users = CustomUser.objects.all()
        serializer = MinimalUserSerializer(users, many=True)
        return Response(serializer.data, status=200)