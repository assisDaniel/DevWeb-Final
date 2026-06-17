import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Storage } from '@ionic/storage-angular';
import { Usuario } from '../login/usuario.model';
import { Tenis } from '../tab1/tenis.model';
import { CapacitorHttp, HttpOptions, HttpResponse } from '@capacitor/core';
import { ActivatedRoute } from '@angular/router';
import { LucideTriangleAlert } from '@lucide/angular'
import {
  AlertController,
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular/standalone';



@Component({
  selector: 'app-deletar-tenis',
  templateUrl: './deletar-tenis.page.html',
  styleUrls: ['./deletar-tenis.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    LucideTriangleAlert,
  ],
  providers: [Storage]
})
export class DeletarTenisPage {
  public usuario: Usuario = new Usuario();
  public tenis: Tenis = new Tenis();
  public id: number = 0;

  public marcas = [
    { id: 1, nome: 'Nike' },
    { id: 2, nome: 'Adidas' },
    { id: 3, nome: 'Puma' },
    { id: 4, nome: 'Converse' },
    { id: 5, nome: 'Vans' },
    { id: 6, nome: 'New Balance' },
  ];

  public categorias = [
    { id: 1, nome: 'Casual' },
    { id: 2, nome: 'Corrida' },
    { id: 3, nome: 'Basquete' },
    { id: 4, nome: 'Skate' },
    { id: 5, nome: 'Trilha' },
    { id: 6, nome: 'Treino' },
  ];

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
          this.tenis.marca = t.marca;
          this.tenis.nome = t.nome;
          this.tenis.preco = t.preco_2;
          this.tenis.categoria = t.categoria;
          this.tenis.foto = await this.carregarFoto(t.foto)
          
        } else {
          this.apresenta_mensagem(resposta.status);
        }
      })
      .catch(async (erro: any) => {
        loading.dismiss();
        this.apresenta_mensagem(erro?.status);
      });
  }

  async deletar() {
    const loading = await this.controle_carregamento.create({ message: 'Deletando...' });
    await loading.present();

    const options: HttpOptions = {
      url: `http://127.0.0.1:8000/tenis/api/deletar/${this.id}/`,
      headers: {
        'Authorization': `Token ${this.usuario.token}`
      },
    };
    
    CapacitorHttp.delete(options)
      .then(async (resposta: HttpResponse) =>{
        loading.dismiss()
        if (resposta.status == 204) {
          const toast = await this.controle_toast.create({
            message: 'Tênis deletado com sucesso!',
            duration: 2000,
            cssClass: 'ion-text-center'
          });
          toast.present();
          this.controle_navegacao.navigateRoot('/tenis/home');
        }else{
          this.apresenta_mensagem(resposta.status);
        }
      })
      .catch(async (erro: any) => {
        loading.dismiss();
        this.apresenta_mensagem(erro?.status);
      });
  }
  
  async carregarFoto(url: string): Promise<string> {
    const resposta = await CapacitorHttp.get({
      url,
      headers: { 'Authorization': `Token ${this.usuario.token}` },
      responseType: 'blob'
    });
    return `data:image/png;base64,${resposta.data}`;
  }

  async apresenta_mensagem(codigo: number) {
    const mensagem = await this.controle_toast.create({
      message: `Falha ao editar tênis: código ${codigo}`,
      cssClass: 'ion-text-center',
      duration: 2000
    });
    mensagem.present();
  }

  getNomeMarca(id: number): string {
    return this.marcas.find(m => m.id === id)?.nome ?? '';
  }

  getNomeCategoria(id: number): string {
    return this.categorias.find(c => c.id === id)?.nome ?? '';
  }
}
