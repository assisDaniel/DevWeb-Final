from django import forms
from django.forms import ModelForm
from tenis.models import Tenis
from djmoney.forms.widgets import MoneyWidget

class FormularioTenis(ModelForm):
    class Meta:
        model = Tenis
        exclude = ['ativo',]
        widgets = {
            'marca': forms.Select(attrs={'class': 'form-select'}),
            'nome': forms.TextInput(attrs={'class': 'form-control'}),
            'preco': MoneyWidget(
                amount_widget=forms.NumberInput(attrs={
                    'class': 'form-control',
                    'step': '0.01',
                    'inputmode': 'decimal',
                }),
                currency_widget=forms.Select(attrs={'class': 'form-select'}, choices=[('BRL', 'BRL'), ('USD', 'USD')]),
            ),
            'ano_lancamento': forms.NumberInput(attrs={'class': 'form-control'}),
            'tamanho': forms.Select(attrs={'class': 'form-select'}),
            'categoria': forms.Select(attrs={'class': 'form-select'}),
            'foto': forms.FileInput(attrs={'class': 'form-control'}),
        }