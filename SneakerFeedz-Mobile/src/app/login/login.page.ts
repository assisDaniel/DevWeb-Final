import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Storage } from '@ionic/storage-angular'
import { IonContent, IonButton, IonList, IonInput, IonItem, IonInputPasswordToggle, LoadingController, NavController, AlertController, ToastController} from '@ionic/angular/standalone';
import { HttpOptions, CapacitorHttp, HttpResponse } from "@capacitor/core"
import { Usuario } from './usuario.model';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  imports: [IonContent, IonButton, IonList, IonInput, IonItem, IonInputPasswordToggle, FormsModule],
  providers: [Storage]
})
export class LoginPage {
  public instancia: {username: string, password: string} = {
    username: '',
    password: ''
  };
  constructor(
    public controle_carregamento: LoadingController,
    public controle_navegacao: NavController,
    public controle_alerta: AlertController,
    public controle_toats: ToastController,
    public storage: Storage
  ) {}

  async ngOnInit() {
    await this.storage.create();
  }

  async autenticarUsuario() {
    const loading = await this.controle_carregamento.create({message: "Autenticando"});
    await loading.present();

    const options: HttpOptions = {
      url: 'http://127.0.0.1:8000/api/login/',
      headers: {'Content-Type': 'application/json'},
      data: this.instancia
    };

    CapacitorHttp.post(options)
      .then(async (resposta: HttpResponse) => {
        if(resposta.status == 200) {
          let usuario: Usuario = Object.assign(new Usuario(), resposta.data);
          await this.storage.set('usuario', usuario);

          loading.dismiss();
          this.controle_navegacao.navigateRoot('/tenis');
        } else {
          loading.dismiss();
          this.apresenta_mensagem(resposta.status);
        }
      })
      .catch(async (erro: any) => {
        console.log(erro);
        loading.dismiss();
        this.apresenta_mensagem(erro?.status);
      });
  }

  async apresenta_mensagem(codigo: number){
    const mensagem = await this.controle_toats.create({
      message: `Falha ao autenticar usuário: código ${codigo}`,
      cssClass: 'ion-text-center',
      duration: 2000
    });
    mensagem.present();
  }
}
