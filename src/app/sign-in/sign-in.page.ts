import {Component, OnInit} from '@angular/core';
import {NavController, Platform, ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import '@codetrix-studio/capacitor-google-auth';

import {RESTService} from '../rest.service';
import {environment} from '../../environments/environment';
import {GoogleAuth} from '@codetrix-studio/capacitor-google-auth';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.page.html',
    styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

    password: string;
    email: string;
    servidor: boolean;
    versionAPI: any;
    urlServer: any;

    constructor(private navCtrl: NavController,
                private route: Router,
                public platform: Platform,
                public toastController: ToastController,
                public rest: RESTService) {
        this.platform.ready().then(async () => {
            GoogleAuth.initialize();
        });
    }

    ngOnInit() {

        this.urlServer = environment.url;

        this.rest.getHealth().subscribe(h => {
            console.log(h);
            this.servidor = h.isUp;
            this.versionAPI = h.version;

            if ( this.servidor && localStorage.getItem('uid') !== null) {
                this.navCtrl.navigateRoot(['./tabs']);
            }

            if (!this.servidor) {
                localStorage.clear();
                sessionStorage.clear();
            }
        });
    }

    tabs() {
        // this.auth.login(this.email, this.password);
        // this.navCtrl.navigateRoot(['./tabs']);
    }


    async loginWithGoogle() {
        if (this.servidor) {
            const googleUser = await GoogleAuth.signIn() as any;



            console.log('my user: ', googleUser);

            //  this.userInfo = googleUser;
            console.log(googleUser.name);


            localStorage.setItem('email', googleUser.email);
            localStorage.setItem('display', googleUser.givenName + ' ' + googleUser.familyName);
            localStorage.setItem('provider', googleUser.providerId);
            localStorage.setItem('photoUrl', googleUser.imageUrl);
            localStorage.setItem('uid', googleUser.id);
            this.presentToast('Inicio de sesión exitoso, Bienvenido');
            this.navCtrl.navigateRoot(['./tabs']);
        } else {
            this.presentToast('Error en servidor intente mas tarde.');
        }
    }

  async loginWithEmail() {
    if (this.servidor) {
      const googleUser = await GoogleAuth.signIn() as any;



      console.log('my user: ', googleUser);

      //  this.userInfo = googleUser;
      console.log(googleUser.name);


      localStorage.setItem('email', googleUser.email);
      localStorage.setItem('display', googleUser.givenName + ' ' + googleUser.familyName);
      localStorage.setItem('provider', googleUser.providerId);
      localStorage.setItem('photoUrl', googleUser.imageUrl);
      localStorage.setItem('uid', googleUser.id);
      this.presentToast('Inicio de sesión exitoso, Bienvenido');
      this.navCtrl.navigateRoot(['./tabs']);
    } else {
      this.presentToast('Error en servidor intente mas tarde.');
    }
  }

    async presentToast(message: string) {
        const toast = await this.toastController.create({
            message,
            duration: 2500
        });
        toast.present();
    }

    resiter_now() {
        this.route.navigate(['./resiter-now']);
    }

    forgot_password() {
        this.route.navigate(['./forgot-password']);
    }

    loginWithFacebook() {
    }
}
