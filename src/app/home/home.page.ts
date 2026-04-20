import {Component, OnInit} from '@angular/core';
import {AlertController, LoadingController, NavController} from '@ionic/angular';
import {Router} from '@angular/router';
import {RESTService} from '../rest.service';
import {CallNumber} from '@awesome-cordova-plugins/call-number/ngx';
import {App as CapacitorApp} from '@capacitor/app';
import {Capacitor} from '@capacitor/core';
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
  isRefreshing = false;

  ordenesOriginales: any[] = [];
  filtroActivo: string = 'ACTIVOS';

  private refreshInterval: any;

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

  private cargarOrdenes(): Promise<void> {
    this.isRefreshing = true;
    return new Promise((resolve) => {
      this.rest.getTodosLosCarritos(localStorage.getItem('uid')).subscribe(
        data => {
          this.isRefreshing = false;
          this.ordenesOriginales = [];
          if (data.length !== 0) {
            this.tieneOrdenes = true;
            data.forEach(orden => {
              const total = orden.items.reduce((sum, item) => {
                return sum + (item.prenda.precio * item.cantidad);
              }, 0);
              orden.total = total;
              this.ordenesOriginales.push(orden);
            });
            this.filtrarOrdenes(this.filtroActivo);
          } else {
            this.tieneOrdenes = false;
            this.ordenes = [];
          }
          resolve();
        },
        () => {
          this.isRefreshing = false;
          resolve();
        }
      );
    });
  }

  async ionViewDidEnter() {
    await this.obtenerCarrito();
    await this.cargarOrdenes();

    if (sessionStorage.getItem('actualizarHome') === 'si') {
      sessionStorage.removeItem('actualizarHome');
    }

    this.refreshInterval = setInterval(() => {
      this.cargarOrdenes();
    }, 30000);
  }

  ionViewWillLeave() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  async handleRefresh(event: any) {
    await this.cargarOrdenes();
    event.target.complete();
  }

  filtrarOrdenes(tipo: string) {
    this.filtroActivo = tipo;

    switch (tipo) {
      case 'ACTIVOS':
        this.ordenes = this.ordenesOriginales.filter(orden =>
          ['CREADO', 'EN_TIENDA', 'TERMINADO', 'EN_RUTA_REPARTIDOR'].includes(orden.estado))
          .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
        break;
      case 'COMPLETADOS':
        this.ordenes = this.ordenesOriginales.filter(orden => orden.estado === 'FINALIZADO')
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
      }, {
        text: 'Salir',
        handler: () => {
          navigator['app'].exitApp();
        }
      }]
    }).then(alert => alert.present());
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
    if (Capacitor.isNativePlatform()) {
      this.callNumber.callNumber('3331221189', true)
        .then(res => console.log('Launched dialer!', res))
        .catch(err => console.log('Error launching dialer', err));
    } else {
      window.open('tel:+523331221189', '_self');
    }
  }

  getStatusClass(estado: string): string {
    const map: {[key: string]: string} = {
      'CREADO': 'status-creado',
      'EN_TIENDA': 'status-tienda',
      'TERMINADO': 'status-terminado',
      'EN_RUTA_REPARTIDOR': 'status-ruta',
      'FINALIZADO': 'status-finalizado',
      'SOLICITA_CANCELACION': 'status-cancelacion',
      'CANCELADO': 'status-cancelado',
    };
    return map[estado] || '';
  }

  getStatusText(estado: string): string {
    const map: {[key: string]: string} = {
      'CREADO': 'Programada para recolección',
      'EN_TIENDA': 'En manos de Sango',
      'TERMINADO': 'Lista para entrega',
      'EN_RUTA_REPARTIDOR': 'En ruta para entrega',
      'FINALIZADO': 'Entregada',
      'SOLICITA_CANCELACION': 'Solicita Cancelación',
      'CANCELADO': 'Cancelada',
    };
    return map[estado] || estado;
  }

  getStatusIcon(estado: string): string {
    const map: {[key: string]: string} = {
      'CREADO': 'car-outline',
      'EN_TIENDA': 'hand-left-outline',
      'TERMINADO': 'cube-outline',
      'EN_RUTA_REPARTIDOR': 'bicycle-outline',
      'FINALIZADO': 'checkmark-circle-outline',
      'SOLICITA_CANCELACION': 'alert-circle-outline',
      'CANCELADO': 'close-circle-outline',
    };
    return map[estado] || 'ellipse-outline';
  }

  calificarServicio(orden: any) {}
}
