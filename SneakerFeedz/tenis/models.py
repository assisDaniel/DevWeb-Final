from django.db import models
from tenis.consts import *
from datetime import datetime
from djmoney.models.fields import MoneyField

# Create your models here.
class Tenis(models.Model):
    marca = models.SmallIntegerField(choices=OPCOES_MARCAS)
    nome = models.CharField(max_length=100)
    tamanho = models.SmallIntegerField(choices=OPCOES_TAMANHOS)
    preco = MoneyField("Preço", max_digits=10, decimal_places=2, default_currency='BRL')
    categoria = models.SmallIntegerField(choices=OPCOES_CATEGORIA)
    ano_lancamento = models.IntegerField("Ano de Lançamento")
    foto = models.ImageField(blank=True, null=True, upload_to='tenis/fotos')
    ativo = models.BooleanField("Está ativo?", default=True, editable=True)
    data_criacao = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name="Tênis"
        verbose_name_plural="Tênis"

    def __str__(self):
        return f'{self.get_marca_display()} - {self.nome} ({self.ano_lancamento})'
    
    def anos_de_uso(self):
        return datetime.now().year - self.ano
    
    @property
    def tenis_novo(self):
        return self.ano_lancamento == datetime.now().year