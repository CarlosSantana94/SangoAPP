import {Component, OnInit} from '@angular/core';
import {AlertController, LoadingController, NavController, Platform, ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import {RESTService} from '../rest.service';
import {environment} from '../../environments/environment';
import {SignInWithApple, SignInWithAppleOptions} from "@capacitor-community/apple-sign-in";
import {Device} from '@capacitor/device';
import {UsuarioV2} from "../models/usuario-v2";
import {FacebookLogin} from "@capacitor-community/facebook-login";
import {SocialLogin} from "@capgo/capacitor-social-login";

interface FacebookProfile {
  id: string;
  email: string;
  name: string;
  picture: {
    data: {
      url: string;
    };
  };
}

// Interfaces for the Google user response
interface GoogleAccessToken {
  token: string;
}

interface GoogleProfile {
  id: string;
  name: string;
  email: string;
  familyName: string;
  givenName: string;
  imageUrl: string;
}

interface GoogleLoginResult {
  accessToken: GoogleAccessToken;
  profile: GoogleProfile;
  idToken: string;
  responseType: string;
}

interface SocialLoginResponse {
  provider: string;
  result: GoogleLoginResult;
}

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
    await SocialLogin.initialize({
      google: {
        webClientId:'726792798295-vbgcc63j11lu3k81fc588ft4duguat34.apps.googleusercontent.com',
        iOSClientId:'726792798295-q9gs9rg4reuled80kmtcdc6v09ao92f8.apps.googleusercontent.com'
      },
    });
    await this.checkPlatform();
    this.serverUrl = environment.url;

    // Initialize Facebook SDK if platform is web
    if (this.platform.is('hybrid') === false) {
      (window as any).fbAsyncInit = () => {
        FB.init({
          appId: environment.facebookAppId,
          cookie: true,
          xfbml: true,
          version: 'v12.0'
        });
      };
    }

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
        const googleUser =  await SocialLogin.login({
          provider: 'google',
          options: {
            scopes: ['email', 'profile'],
          },
        }) as SocialLoginResponse;

       let userV2 = new UsuarioV2(
         googleUser.result.profile.id,
         googleUser.result.profile.email,
          false,
         googleUser.result.profile.imageUrl,
         googleUser.result.profile.name,
          "GOOGLE LOGIN",
          null,
         googleUser.result.idToken,
          null
        );
        localStorage.setItem('uid', googleUser.result.profile.id);
        this.rest.postUsuarioV2(userV2).subscribe(
          response => {

              this.setUserInfo(googleUser.result.profile.email, `${ googleUser.result.profile.name} `, googleUser.result.profile.imageUrl, googleUser.result.profile.id);
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

  async loginWithFacebook() {
    try {
      if (!this.servidor) {
        throw new Error('Servidor no disponible');
      } else {
        const FACEBOOK_PERMISSIONS = ['email', 'public_profile'];

        const result = await FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS });

        if (result.accessToken) {
          // Token is available
          const token = result.accessToken.token;

          // Optionally, you can also fetch the user details
          const profile = await FacebookLogin.getProfile({fields: ['email', 'name', 'picture']}) as unknown as FacebookProfile;

          const facebookUser: FacebookProfile = profile;

          let userV2 = new UsuarioV2(
            facebookUser.id,
            facebookUser.email,
            false,
            facebookUser.picture.data.url,
            facebookUser.name,
            "FACEBOOK LOGIN",
            null,
            token,
            null
          );

          localStorage.setItem('uid', facebookUser.id);
          this.rest.postUsuarioV2(userV2).subscribe(
            response => {
              if (response.status === 200) {
                this.setUserInfo(facebookUser.email, facebookUser.name, facebookUser.picture.data.url, facebookUser.id);
                this.presentToast('Inicio de sesión exitoso, Bienvenido');
                this.navCtrl.navigateRoot(['./tabs']);
              }
            },
            error => {
              console.error('Error en la solicitud:', error);
              this.presentToast('Error en el inicio de sesión, intente de nuevo');
            }
          );
        } else {
          this.presentToast('Inicio de sesión cancelado');
        }
      }
    } catch (error) {
      this.presentToast('Error en servidor intente mas tarde.');
      console.error('Facebook login error: ', error);
    }
  }



}
