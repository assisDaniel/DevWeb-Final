from rest_framework import serializers
from tenis.models import Tenis

class SerializerTenis(serializers.ModelSerializer):
    nome_marca = serializers.SerializerMethodField()
    nome_categoria = serializers.SerializerMethodField()
    preco = serializers.SerializerMethodField()

    class Meta:
        model = Tenis
        exclude = ['ativo', 'data_criacao', 'preco_currency']

    def get_nome_marca(self, instancia):
        return instancia.get_marca_display()
    
    def get_preco(self, instancia):
        return f'{instancia.preco}'
    
    def get_nome_categoria(self, instancia):
        return instancia.get_categoria_display()
    
class SerializerCriarEditarTenis(serializers.ModelSerializer):
    preco_2 = serializers.SerializerMethodField()

    class Meta:
        model = Tenis
        exclude = ['ativo', 'data_criacao']

    def get_preco_2(self, instancia):
        return f'{instancia.preco}'