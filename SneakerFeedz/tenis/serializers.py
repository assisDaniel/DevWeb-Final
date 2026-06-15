from rest_framework import serializers
from tenis.models import Tenis

class SerializerTenis(serializers.ModelSerializer):
    nome_marca = serializers.SerializerMethodField()
    nome_categoria = serializers.SerializerMethodField()

    class Meta:
        model = Tenis
        exclude = []

    def get_nome_marca(self, instancia):
        return instancia.get_marca_display()
    
    def get_nome_cor(self, instancia):
        return instancia.get_cor_display()
    
    def get_nome_categoria(self, instancia):
        return instancia.get_categoria_display()
    
