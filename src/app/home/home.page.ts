import {Component, Inject, OnInit} from '@angular/core';
import {AlertController, NavController, Platform} from '@ionic/angular';
import {Router} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {RESTService} from '../rest.service';
import {CallNumber} from '@awesome-cordova-plugins/call-number/ngx';
import {App as CapacitorApp} from '@capacitor/app';
import {GoogleAuth} from "@codetrix-studio/capacitor-google-auth";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  nombre: string;
  ordenes = [];
  tieneOrdenes = false;
  servicios: any = [];
  carrito: any = {};

  constructor(private navCtrl: NavController,
              private route: Router,
              private modalController: ModalController,
              private rest: RESTService,
              private platform: Platform,
              public alertController: AlertController,
              private callNumber: CallNumber) {

    const usuario = {
      id: localStorage.getItem('uid'),
      nombre: localStorage.getItem('display'),
      email: localStorage.getItem('email'),
      img: localStorage.getItem('photoUrl')
    };

    this.rest.postUsuario(usuario).subscribe(data => {
      console.log(data);
      this.obtenerCarrito();
    });


  }

  showExitConfirm() {


    this.alertController.create({
      header: 'Salir de SANGO',
      message: 'Deseas salir?',
      backdropDismiss: false,
      buttons: [{
        text: 'No',
        role: 'cancel',
        handler: () => {
          console.log('Application exit prevented!');
        }
      }, {
        text: 'Salir',
        handler: () => {
          navigator['app'].exitApp();
        }
      }]
    })
      .then(alert => {
        alert.present();
      });
  }


  ionViewDidEnter() {
    this.obtenerCarrito();
    CapacitorApp.addListener('backButton', ({canGoBack}) => {

      // alert(this.route.url);

      if (this.route.url.includes('home') || this.route.url.includes('HOME')) {
        this.showExitConfirm();
      } else {
        window.history.back();
      }
    });

  }

  obtenerCarrito() {
    this.rest.getCarrito().subscribe(carrito => {
      this.carrito = carrito;
      console.log(this.carrito);
      if (isNaN(this.carrito.id)) {
        this.obtenerCarrito();
      }
    });
  }

  ngOnInit() {



    this.nombre = localStorage.getItem('display');
    this.rest.getServicios().subscribe(data => {
      this.servicios = data;
      console.log(data);

    });

    this.rest.getPedidos().subscribe(data => {
      if (data.length !== 0) {
        console.log('Tiene ordenes ' + data.length);
        this.tieneOrdenes = true;
        this.ordenes = data;
        console.log(this.ordenes);
        this.obtenerCarrito();
      }
      console.log(data);
    });

  }

  offers() {
    this.navCtrl.navigateRoot(['./tabs/offers']);
  }

  select_clothes(segment: any) {
    localStorage.setItem('segment', segment);
    this.route.navigate(['./select-clothes']);
  }

  seleccionarSeccion(seccion: string) {
    const idServicio = this.servicios.find(element => element.nombre === seccion);
    console.log(idServicio);

    sessionStorage.setItem('idServicio', idServicio.id);
    sessionStorage.setItem('nombreServicio', idServicio.nombre);
    this.route.navigate(['./seccion']);
  }

  order_info(id: any) {
    localStorage.setItem('pedidoSeleccionado', id);
    this.route.navigate(['./order-info']);
  }

  select_planchado() {
    this.route.navigate(['./planchado']);
  }

  goToCart() {
    this.route.navigate(['/carrito']);
  }


  llamar() {
    this.callNumber.callNumber('3331221189', true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  calificarServicio(orden) {

  }


}
