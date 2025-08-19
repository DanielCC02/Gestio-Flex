from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('usuario/', include('usuario.urls')),
    path('insumo/', include('insumo.urls')),
    path('insumoservicio/', include('insumoservicio.urls')),
    path('ot/', include('ot.urls')),
    path('otservicio/', include('otservicio.urls')),
    path('otusuario/', include('otusuario.urls')),
    path('servicio/', include('servicio.urls')),
]
