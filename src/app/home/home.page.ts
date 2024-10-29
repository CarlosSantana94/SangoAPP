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
   this.rest.getCarritoNuevoPorUsuarioId(localStorage.getItem('uid')).subscribe(data => {
     this.carrito = data;
   });
  }


  ngOnInit() {
    this.obtenerCarrito();


    this.nombre = localStorage.getItem('display');
    this.rest.getServicios().subscribe(data => {
      this.servicios = data;
    });
  }

  async ionViewDidEnter() {
    await this.obtenerCarrito();
    this.ordenes = [];
    this.rest.getTodosLosCarritos(localStorage.getItem('uid')).subscribe(data => {
      if (data.length !== 0) {
        this.tieneOrdenes = true;

        data.forEach(orden =>{
          const total = orden.items.reduce((sum, item) => {
            return sum + (item.prenda.precio * item.cantidad);
          }, 0);

          orden.total = total;
          this.ordenes.push(orden);
        });
        console.log(this.ordenes)
      }

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
    }).then(alert => {
      alert.present();
    });
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

  llamar() {
    this.callNumber.callNumber('3331221189', true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  calificarServicio(orden) {
  }

}
