from django.contrib import admin
from tenis.models import Tenis

# Register your models here.
@admin.register(Tenis)
class TenisAdmin(admin.ModelAdmin):
    list_display = ('id', 'marca', 'nome', 'ano_lancamento', 'tamanho', 'preco', 'ativo')
    search_fields = ('modelo', 'nome')
    list_editable = ('ativo',)