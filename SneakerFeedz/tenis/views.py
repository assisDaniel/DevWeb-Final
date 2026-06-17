from django.views.generic import View, ListView, CreateView, UpdateView, DeleteView
from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from tenis.consts import OPCOES_MARCAS
from tenis.models import Tenis
from tenis.forms import FormularioTenis
from tenis.serializers import SerializerTenis, SerializerCriarEditarTenis
from django.urls import reverse_lazy
from django.http import FileResponse, Http404
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from django.contrib.auth.mixins import LoginRequiredMixin

# Create your views here.
class ListarTenis(LoginRequiredMixin, ListView):
    model = Tenis
    context_object_name = 'tenis'
    template_name = 'tenis/listar.html'

    def get_queryset(self, **kwargs):
        pesquisa = self.request.GET.get('pesquisa', None)
        queryset = Tenis.objects.filter(ativo=True)
        if pesquisa:
            marcas = [
                chave for chave, valor in OPCOES_MARCAS
                if pesquisa.lower() in valor.lower()
            ]

            queryset = queryset.filter(
                Q(nome__icontains=pesquisa) |
                Q(marca__in=marcas)
            )
        return queryset

class CriarTenis(LoginRequiredMixin, CreateView):
    model = Tenis
    form_class = FormularioTenis
    template_name = 'tenis/novo.html'
    success_url = reverse_lazy('listar-tenis')

class EditarTenis(LoginRequiredMixin, UpdateView):
    model = Tenis
    form_class = FormularioTenis
    template_name = 'tenis/editar.html'

    success_url = reverse_lazy('listar-tenis')

class DeletarTenis(LoginRequiredMixin, DeleteView):
    model = Tenis
    template_name = 'tenis/deletar.html'
    success_url = reverse_lazy('listar-tenis')

class FotoTenis(View):
    model = Tenis
    def get(self, request, arquivo):
        try: 
            tenis = Tenis.objects.get(
                foto=f'tenis/fotos/{arquivo}'
            )
            return FileResponse(tenis.foto)
        except ObjectDoesNotExist:
            raise Http404("Foto não encontrada ou acesso não autorizado")
        except Exception as exception:
            raise exception
    



class APIListarTenis(ListAPIView):
    serializer_class = SerializerTenis
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Tenis.objects.filter(ativo=True)
class APIDetalharTenis(RetrieveAPIView):
    serializer_class = SerializerCriarEditarTenis
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Tenis.objects.filter(ativo=True)
    lookup_url_kwarg = 'id'

class APICriarTenis(CreateAPIView):
    serializer_class = SerializerCriarEditarTenis
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()
class APIEditarTenis(UpdateAPIView):
    serializer_class = SerializerCriarEditarTenis
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Tenis.objects.filter(ativo=True)
class APIDeletarTenis(DestroyAPIView):
    queryset = Tenis.objects.filter(ativo=True)
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
