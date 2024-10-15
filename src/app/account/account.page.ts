import {Component, Inject, OnInit} from '@angular/core';
import {NavController, Platform} from '@ionic/angular';
import {Router} from '@angular/router';
import {APP_CONFIG, AppConfig} from '../app.config';
import {ModalController} from '@ionic/angular';
import {GoogleAuth} from '@codetrix-studio/capacitor-google-auth';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  email = localStorage.getItem('email');
  nombre = localStorage.getItem('display');
  photoURL = localStorage.getItem('photoUrl');


  constructor(@Inject(APP_CONFIG) public config: AppConfig, private navCtrl: NavController, private route: Router,
              private modalController: ModalController, public platform: Platform) {
    this.platform.ready().then(async () => {
      GoogleAuth.initialize();
    });
  }

  ngOnInit() {
  }

  my_orders() {
    this.route.navigate(['./my-orders']);
  }

  my_profile() {
    this.route.navigate(['./my-profile']);
  }

  my_address() {
    this.route.navigate(['./my-address']);
  }

  faq() {
    this.route.navigate(['./faq']);
  }

  contact_us() {
    this.route.navigate(['./contact-us']);
  }

  terms_conditions() {
    this.route.navigate(['./terms-conditions']);
  }

  chat_with_us() {
    this.route.navigate(['./contact-us2']);
  }

  change_language() {
    this.route.navigate(['./change-language']);
  }


  developed_by() {
    window.open('https://opuslab.works/', '_system', 'location=no');
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    GoogleAuth.signOut();
    this.navCtrl.navigateRoot(['./sign-in']);
  }

  zonaDeCobertura() {
    this.route.navigate(['./zona-de-cobertura']);
  }

  avisoDePrivacidad() {
    this.route.navigate(['./aviso-de-privacidad']);
  }
}
