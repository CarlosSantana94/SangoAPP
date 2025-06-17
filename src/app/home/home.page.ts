import {Component, OnInit} from '@angular/core';
import {AlertController, LoadingController, NavController} from '@ionic/angular';
import {Router} from '@angular/router';
import {RESTService} from '../rest.service';
import {CallNumber} from '@awesome-cordova-plugins/call-number/ngx';
import {App as CapacitorApp} from '@capacitor/app';
import {FcmService} from "../services/fcm.service";
import {ActionPerformed, PushNotifications, PushNotificationSchema, Token} from "@capacitor/push-notifications";

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
  notifMSG: string;

  ordenesOriginales: any[] = []; // Para guardar todas las órdenes sin filtrar
  filtroActivo: string = 'ACTIVOS'; // Para saber qué filtro está activo


  constructor(private navCtrl: NavController,
              private route: Router,
              private rest: RESTService,
              private loadingController: LoadingController,
              public alertController: AlertController,
              private callNumber: CallNumber,
              private fcmService: FcmService) {


  }


  async obtenerCarrito() {
    this.rest.getCarritoNuevoPorUsuarioId(localStorage.getItem('uid')).subscribe(async data => {
      this.carrito = data;

      await this.fcmService.initPushNotifications(localStorage.getItem('uid'));
    });
  }


  ngOnInit() {
    this.obtenerCarrito();


    this.nombre = localStorage.getItem('display');
    this.rest.getServicios().subscribe(data => {
      this.servicios = data;
    });
  }


  // Modifica tu método ionViewDidEnter para guardar las órdenes originales
  async ionViewDidEnter() {
    await this.obtenerCarrito();
    this.ordenes = [];
    this.ordenesOriginales = []; // Limpiar el array antes de cargar nuevas órdenes


    this.rest.getTodosLosCarritos(localStorage.getItem('uid')).subscribe(data => {
      if (data.length !== 0) {
        this.tieneOrdenes = true;

        data.forEach(orden => {
          const total = orden.items.reduce((sum, item) => {
            return sum + (item.prenda.precio * item.cantidad);
          }, 0);

          orden.total = total;
          this.ordenesOriginales.push(orden);
        });

        // Aplicar filtro por defecto (Pedidos Activos)
        this.filtrarOrdenes('ACTIVOS');
      } else {
        this.tieneOrdenes = false;
      }
    });
  }

// Agrega este nuevo método para filtrar las órdenes

  filtrarOrdenes(tipo: string) {
    this.filtroActivo = tipo;

    switch (tipo) {
      case 'ACTIVOS':
        this.ordenes = this.ordenesOriginales.filter(orden =>
          ['CREADO', 'EN_TIENDA', 'TERMINADO', 'EN_RUTA_REPARTIDOR'].includes(orden.estado))
          .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
        break;

      case 'COMPLETADOS':
        this.ordenes = this.ordenesOriginales.filter(orden =>
          orden.estado === 'FINALIZADO')
          .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
        break;

      case 'CANCELACIONES':
        this.ordenes = this.ordenesOriginales.filter(orden =>
          ['SOLICITA_CANCELACION', 'CANCELADO'].includes(orden.estado))
          .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
        break;

      case 'TODOS':
        this.ordenes = [...this.ordenesOriginales]
          .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
        break;
    }

    this.tieneOrdenes = this.ordenes.length > 0;
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
