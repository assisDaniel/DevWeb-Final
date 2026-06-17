import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AlertController,
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular/standalone';
import { CapacitorHttp, HttpOptions, HttpResponse } from '@capacitor/core';
import { Storage } from '@ionic/storage-angular';
import { Usuario } from '../login/usuario.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editar-tenis',
  templateUrl: 'editar-tenis.page.html',
  styleUrls: ['editar-tenis.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
  ],
  providers: [Storage]
})
export class EditarTenisPage {
  public usuario: Usuario = new Usuario();
  public id: number = 0;

  public marcas = [
    { id: 1, nome: 'Nike' },
    { id: 2, nome: 'Adidas' },
    { id: 3, nome: 'Puma' },
    { id: 4, nome: 'Converse' },
    { id: 5, nome: 'Vans' },
    { id: 6, nome: 'New Balance' },
  ];

  public tamanhos = [34, 35, 36, 37, 38, 39, 40, 41, 42];

  public categorias = [
    { id: 1, nome: 'Casual' },
    { id: 2, nome: 'Corrida' },
    { id: 3, nome: 'Basquete' },
    { id: 4, nome: 'Skate' },
    { id: 5, nome: 'Trilha' },
    { id: 6, nome: 'Treino' },
  ];

  public moedas = ['BRL', 'USD'];

  public form = {
    marca: null as number | null,
    nome: '',
    preco: null as number | null,
    preco_currency: 'BRL',
    tamanho: null as number | null,
    categoria: null as number | null,
    ano_lancamento: null as number | null,
    foto: null as File | null,
  };

  constructor(
    public storage: Storage,
    public controle_carregamento: LoadingController,
    public controle_navegacao: NavController,
    public controle_toast: ToastController,
    public controle_alerta: AlertController,
    public route: ActivatedRoute,
  ) {}

  async ngOnInit() {
    await this.storage.create();
    const registro = await this.storage.get('usuario');
    if (registro) {
      this.usuario = Object.assign(new Usuario(), registro);
    } else {
      this.controle_navegacao.navigateRoot('');
    }

    this.id = Number(this.route.snapshot.paramMap.get('id'));
    await this.carregarTenis();
  }

  async carregarTenis() {
    const loading = await this.controle_carregamento.create({ message: 'Carregando...' });
    await loading.present();

    const options: HttpOptions = {
      url: `http://127.0.0.1:8000/tenis/api/detalhar/${this.id}/`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${this.usuario.token}`
      }
    };

    CapacitorHttp.get(options)
      .then(async (resposta: HttpResponse) => {
        loading.dismiss();
        if (resposta.status == 200) {
          const t = resposta.data;
          this.form.marca = t.marca;
          this.form.nome = t.nome;
          this.form.preco = t.preco;
          this.form.preco_currency = t.preco_currency;
          this.form.tamanho = t.tamanho;
          this.form.categoria = t.categoria;
          this.form.ano_lancamento = t.ano_lancamento;
        } else {
          this.apresenta_mensagem(resposta.status);
        }
      })
      .catch(async (erro: any) => {
        loading.dismiss();
        this.apresenta_mensagem(erro?.status);
      });
  }

  onFotoSelecionada(event: any) {
    this.form.foto = event.target.files[0];
  }

  async salvar() {
    const loading = await this.controle_carregamento.create({ message: 'Salvando...' });
    await loading.present();

    const formData = new FormData();
    formData.append('marca', String(this.form.marca));
    formData.append('nome', this.form.nome);
    formData.append('preco', String(this.form.preco));
    formData.append('preco_currency', this.form.preco_currency);
    formData.append('tamanho', String(this.form.tamanho));
    formData.append('categoria', String(this.form.categoria));
    formData.append('ano_lancamento', String(this.form.ano_lancamento));
    if (this.form.foto) {
      formData.append('foto', this.form.foto);
    }

    const options: HttpOptions = {
      url: `http://127.0.0.1:8000/tenis/api/editar/${this.id}/`,
      headers: {
        'Authorization': `Token ${this.usuario.token}`
      },
      data: formData
    };

    CapacitorHttp.patch(options)
      .then(async (resposta: HttpResponse) => {
        loading.dismiss();
        if (resposta.status == 200) {
          const toast = await this.controle_toast.create({
            message: 'Tênis atualizado com sucesso!',
            duration: 2000,
            cssClass: 'ion-text-center'
          });
          toast.present();
          this.controle_navegacao.navigateRoot('/tenis/home');
        } else {
          this.apresenta_mensagem(resposta.status);
        }
      })
      .catch(async (erro: any) => {
        loading.dismiss();
        this.apresenta_mensagem(erro?.status);
      });
  }

  async apresenta_mensagem(codigo: number) {
    const mensagem = await this.controle_toast.create({
      message: `Falha ao editar tênis: código ${codigo}`,
      cssClass: 'ion-text-center',
      duration: 2000
    });
    mensagem.present();
  }
}