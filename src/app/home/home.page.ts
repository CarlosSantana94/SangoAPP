import {Component, OnInit} from '@angular/core';
import {AlertController, LoadingController, NavController} from '@ionic/angular';
import {Router} from '@angular/router';
import {RESTService} from '../rest.service';
import {CallNumber} from '@awesome-cordova-plugins/call-number/ngx';
import {App as CapacitorApp} from '@capacitor/app';

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
  refresh: any;

  constructor(private navCtrl: NavController,
              private route: Router,
              private rest: RESTService,
              private loadingController: LoadingController,
              public alertController: AlertController,
              private callNumber: CallNumber) {


  }


  async obtenerCarrito() {
    let usuario = {
      id: localStorage.getItem('uid'),
      nombre: localStorage.getItem('display'),
      email: localStorage.getItem('email'),
      img: localStorage.getItem('photoUrl'),
      puedePagarConCC: false
    };

    // TODO si no existe lo crea

    this.rest.postUsuario(usuario).subscribe(data => {
    });

    console.log("USUARIO A CREAR");
    console.log(usuario);

    this.rest.getUsuario(localStorage.getItem('uid')).subscribe(u => {
      localStorage.setItem("puedePagarCC", u.puedePagarConCC);
      usuario.puedePagarConCC = u.puedePagarConCC;

      this.rest.postUsuario(usuario).subscribe(data => {

      });
    });

    const loader = await this.loadingController.create({
      message: 'Obteniendo Datos...',
      spinner: 'bubbles',
    });
    await loader.present();
    this.rest.getCarrito().subscribe(async carrito => {
      await loader.dismiss();
      this.carrito = carrito;
      console.log(this.carrito);
      if (isNaN(this.carrito.id)) {
        this.obtenerCarrito();
      }
    });
  }


  ngOnInit() {
    this.obtenerCarrito();


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
      }
      console.log(data);
    });
  }

  async ionViewDidEnter() {
    await this.obtenerCarrito();
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
    }).then(alert => {
      alert.present();
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

  actualizarOrdenes() {
    this.ngOnInit();
  }
}
