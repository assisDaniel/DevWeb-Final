import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LucidePencil, LucideTrash, LucideLogOut } from '@lucide/angular'
import {
  AlertController,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
  LoadingController,
  NavController,
  ToastController,
  IonButton,
  IonButtons,
} from '@ionic/angular/standalone';

import { Usuario } from '../login/usuario.model';
import { Tenis } from './tenis.model';
import { CapacitorHttp, HttpOptions, HttpResponse } from '@capacitor/core';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    LucidePencil,
    LucideTrash,
    LucideLogOut,
    IonButton,
    IonButtons,
  ],
  providers: [Storage]
})
export class Tab1Page {
  public usuario: Usuario = new Usuario();
  public lista_tenis: Tenis[] = [];
  constructor(
      public storage: Storage,
      public controle_carregamento: LoadingController,
      public controle_navegacao: NavController,
      public controle_alerta: AlertController,
      public controle_toast: ToastController,
    ) {}

    async ngOnInit() {
      await this.storage.create();
      const registro = await this.storage.get('usuario');

      if(registro) {
        this.usuario = Object.assign(new Usuario(), registro);
      } else {
        this.controle_navegacao.navigateRoot('')
      }
    }

    async ionViewWillEnter() {
      await this.consultarTenis();
    }

    editar(id: number) {
      this.controle_navegacao.navigateForward(`/tenis/editar/${id}`);
    }
    
    deletar(id: number) {
      this.controle_navegacao.navigateForward(`/tenis/deletar/${id}`);
    }

    async consultarTenis() {
      const loading = await this.controle_carregamento.create();
      await loading.present();

      const options: HttpOptions = {
        url: 'http://127.0.0.1:8000/tenis/api/listar/',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${this.usuario.token}`
        }
      }

      CapacitorHttp.get(options)
        .then(async (resposta: HttpResponse) => {
          if(resposta.status == 200) {
            this.lista_tenis = await Promise.all(resposta.data.map(async (tenis: Tenis) => {
              tenis.foto = await this.carregarFoto(tenis.foto);
              return tenis;
            }));
            console.log(this.lista_tenis);

            loading.dismiss();
          } else {
            loading.dismiss();
            this.apresenta_mensagem(resposta.status)
          }
        })
        .catch(async (erro: any) => {
          console.log(erro);
          loading.dismiss();
          this.apresenta_mensagem(erro?.status)
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

    async apresenta_mensagem(codigo: number){
      const mensagem = await this.controle_toast.create({
        message: `Falha ao consultar os tênis: código ${codigo}`,
        cssClass: 'ion-text-center',
        duration: 2000
      });
      mensagem.present();
    }

    async logout() {
      await CapacitorHttp.post({
        url: 'http://127.0.0.1:8000/api/logout/',
        headers: { 'Authorization': `Token ${this.usuario.token}` }
      });
      await this.storage.remove('usuario');
      this.controle_navegacao.navigateRoot('');
    }
}
