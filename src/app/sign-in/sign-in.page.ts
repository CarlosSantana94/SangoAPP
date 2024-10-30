import {Component, OnInit} from '@angular/core';
import {AlertController, LoadingController, NavController, Platform, ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import '@codetrix-studio/capacitor-google-auth';
import {RESTService} from '../rest.service';
import {environment} from '../../environments/environment';
import {GoogleAuth} from '@codetrix-studio/capacitor-google-auth';
import {SignInWithApple, SignInWithAppleOptions} from "@capacitor-community/apple-sign-in";
import {Device} from '@capacitor/device';
import {UsuarioV2} from "../models/usuario-v2";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

  password: string;
  email: string;
  servidor: boolean;
  apiVersion: string;
  serverUrl: string;
  showAppleSignIn = false;
  user = null;

  constructor(
    private navCtrl: NavController,
    private route: Router,
    private platform: Platform,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private rest: RESTService
  ) {
  }

  async ngOnInit() {
    await this.platform.ready();
    GoogleAuth.initialize();
    await this.checkPlatform();
    this.serverUrl = environment.url;

    const loader = await this.loadingController.create({
      message: 'Obteniendo datos del servidor...',
      spinner: 'bubbles',
    });
    await loader.present();

    this.rest.getHealth().subscribe(
      (h) => {
        this.servidor = h.isUp;
        this.apiVersion = h.version;
        loader.dismiss();
        if (this.servidor && localStorage.getItem('uid')) {
          this.navCtrl.navigateRoot(['./tabs']);
        } else {
          this.clearStorage();
        }
      },
      (error) => {
        loader.dismiss();
        this.presentToast('Error al obtener datos del servidor.');
        console.error('Error retrieving server health: ', error);
      }
    );
  }

  async loginWithGoogle() {
    try {
      if (!this.servidor) {
        throw new Error('Servidor no disponible');
      } else {
        const googleUser = await GoogleAuth.signIn();

        let userV2 = new UsuarioV2(
          googleUser.id,
          googleUser.email,
          false,
          googleUser.imageUrl,
          googleUser.givenName + " " + googleUser.familyName,
          "GOOGLE LOGIN",
          null,
          googleUser.authentication.accessToken,
          null
        );
        localStorage.setItem('uid', googleUser.id);
        this.rest.postUsuarioV2(userV2).subscribe(
          response => {

              this.setUserInfo(googleUser.email, `${googleUser.givenName} ${googleUser.familyName}`, googleUser.imageUrl, googleUser.id);
              this.presentToast('Inicio de sesión exitoso, Bienvenido');
              this.navCtrl.navigateRoot(['./tabs']);

          },
          error => {
            console.error('Error en la solicitud:', error);
            this.presentToast('Error en el inicio de sesión, intente de nuevo');
          }
        );


      }

    } catch (error) {
      this.presentToast('Error en servidor intente mas tarde.');
      console.error('Google login error: ', error);
    }
  }

  async loginWithApple() {
    try {
      if (!this.servidor) {
        throw new Error('Servidor no disponible');
      } else {
        const options: SignInWithAppleOptions = {
          clientId: 'com.bucapps.sango.services',
          redirectURI: 'https://sango-tintorerias.firebaseapp.com/__/auth/handler',
          scopes: 'email name',
          state: '12345',
        };
        const result = await SignInWithApple.authorize(options);

        let userV2 = new UsuarioV2(
          result.response.user,
          result.response.email,
          false,
          "",
          result.response.givenName + " " + result.response.familyName,
          "APPLE LOGIN",
          null,
          "apple notification TODO",
          null
        );
        localStorage.setItem('uid', result.response.user);
        this.rest.postUsuarioV2(userV2).subscribe(
          response => {
            if (response.status === 200) {
              this.setUserInfo(result.response.email, `${result.response.givenName} ${result.response.familyName}`, '', result.response.user);
              this.presentToast('Inicio de sesión exitoso, Bienvenido');
              this.navCtrl.navigateRoot(['./tabs']);
            }
          },
          error => {
            console.error('Error en la solicitud:', error);
            this.presentToast('Error en el inicio de sesión, intente de nuevo');
          }
        );

      }

    } catch (error) {
      this.presentToast('Error en servidor de apple intente mas tarde.');
      console.error('Apple login error: ', error);
    }
  }

  async checkPlatform() {
    try {
      const info = await Device.getInfo();
      this.showAppleSignIn = info.platform === 'ios';
      console.log(`The device is running ${info.platform}.`);
    } catch (error) {
      console.error("Error retrieving device information: ", error);
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2500
    });
    toast.present();
  }

  private setUserInfo(email: string, displayName: string, photoUrl: string, uid: string) {
    localStorage.setItem('email', email);
    localStorage.setItem('display', displayName);
    localStorage.setItem('photoUrl', photoUrl);
    localStorage.setItem('uid', uid);
  }

  private clearStorage() {
    localStorage.clear();
    sessionStorage.clear();
  }

  verServicios() {
    this.navCtrl.navigateRoot(['./servicios-sin-cuenta']);
  }
}
