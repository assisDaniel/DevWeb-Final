"""
URL configuration for sistema project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from tenis.views import *

urlpatterns = [
    path('api/listar/', APIListarTenis.as_view(), name='api-listar-tenis'),
    path('api/detalhar/<int:id>/', APIDetalharTenis.as_view(), name='api-detalhar-tenis'),
    path('api/criar/', APICriarTenis.as_view(), name='api-criar-tenis'),
    path('api/editar/<int:pk>/', APIEditarTenis.as_view(), name='api-editar-tenis'),
    path('api/deletar/<int:pk>/', APIDeletarTenis.as_view(), name='api-deletar-tenis'),
    
    path('', ListarTenis.as_view(), name='listar-tenis'),
    path('criar/', CriarTenis.as_view(), name='criar-tenis'),
    path('editar/<int:pk>/', EditarTenis.as_view(), name='editar-tenis'),
    path('deletar/<int:pk>/', DeletarTenis.as_view(), name='deletar-tenis'),
    path('fotos/<str:arquivo>/', FotoTenis.as_view(), name='foto-tenis'),
    
    
]