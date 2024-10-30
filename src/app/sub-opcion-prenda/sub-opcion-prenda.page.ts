import {Component, OnInit} from '@angular/core';
import {RESTService} from '../rest.service';
import {Router} from '@angular/router';
import {PhotoViewer} from '@awesome-cordova-plugins/photo-viewer/ngx';
import {LoadingController, ModalController} from '@ionic/angular';
import {ModalImagenPage} from './modal-imagen/modal-imagen.page';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-sub-opcion-prenda',
  templateUrl: './sub-opcion-prenda.page.html',
  styleUrls: ['./sub-opcion-prenda.page.scss'],
})
export class SubOpcionPrendaPage implements OnInit {
  nombreServicio: any;
  idOpcion: any;
  nombreOpcion: any;
  subPrendas: any = [];
  carrito: any = {};
  idCarrito: any;
  total: number;
  totalPrendas: number;
  tieneCuenta: boolean = false;


  constructor(private rest: RESTService,
              public modalController: ModalController,
              private route: Router,
              private loadingController: LoadingController,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.nombreServicio = sessionStorage.getItem('nombreServicio');
    this.nombreOpcion = sessionStorage.getItem('nombreOpcion');
    this.idOpcion = sessionStorage.getItem('idOpcion');

    // this.actualizarCantidadPrendas();

    if (localStorage.getItem('uid') !== null) {
      this.tieneCuenta = true;
      this.obtenerCantidadesEnCarrito();
    } else {
      this.tieneCuenta = false;
      this.rest.getSubOpciones(this.idOpcion).subscribe(data => {
        this.subPrendas = data;
      });
    }

  }

  async obtenerCantidadesEnCarrito() {
    const loader = await this.loadingController.create({
      message: 'Actualizando Información',
      spinner: 'bubbles', // Optional: 'dots', 'bubbles', etc.
    });
    await loader.present();
    this.rest.getSubOpciones(this.idOpcion).subscribe(data => {
      this.subPrendas = data;
      this.rest.getResumenCarritoV2(localStorage.getItem('uid')).subscribe(resumen => {
        loader.dismiss();
        const detalles = resumen.detalles;
        console.log(resumen)
        this.idCarrito = resumen.id;
        this.total = resumen.total;
        this.totalPrendas = resumen.totalPrendas;

        // Recorrer todas las subOpciones (subPrendas)
        this.subPrendas.forEach(subOpcion => {
          // Buscar en los ítems del resumen
          detalles.forEach(res => {
            if (res.id == subOpcion.id) {
              subOpcion.cantidad = res.cantidad
            }

          });


        });
      });

    });

  }

  async agregarPrenda(prenda: any) {
    const loader = await this.loadingController.create({
      message: 'Agregando Prenda al Carrito...',
      spinner: 'bubbles', // Optional: 'dots', 'bubbles', etc.
    });
    await loader.present();
    this.rest.postActualizarCarritoV2(localStorage.getItem('uid'), prenda.id, 1).subscribe(data => {
      loader.dismiss();
      this.obtenerCantidadesEnCarrito();
    });
  }

  async removerPrenda(prenda: any) {
    const loader = await this.loadingController.create({
      message: 'Eliminando Prenda al Carrito...',
      spinner: 'bubbles', // Optional: 'dots', 'bubbles', etc.
    });
    await loader.present();
    this.rest.actualizarCantidadDePrendaEnCarrito(this.idCarrito, prenda.id, prenda.cantidad - 1).subscribe(data => {
      loader.dismiss();
      this.obtenerCantidadesEnCarrito();
    });
  }

  async actualizarCantidadPrendas() {
    const loader = await this.loadingController.create({
      message: 'Actualizando Carrito...',
      spinner: 'bubbles', // Optional: 'dots', 'bubbles', etc.
    });
    await loader.present();
    this.rest.getCarrito().subscribe(carrito => {
      console.log(carrito);
      this.carrito = carrito;
      this.rest.getSubOpciones(this.idOpcion).subscribe(data => {
        this.subPrendas = data;
        console.log(data);
      });
      loader.dismiss();
    });

  }


  async abrirModal(pathPrenda) {
    const modal = await this.modalController.create({
      component: ModalImagenPage,
      cssClass: 'my-custom-class',
      componentProps: {
        url: pathPrenda
      }
    });
    return await modal.present();
  }

  irAEnvios() {
    this.route.navigate(['./envios']);
  }

  goToCart() {
    this.route.navigate(['./carrito']);
  }

  trackByFn(index: number, item: any): number {
    return item.serialNumber;
  }


  getSantizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + url);
  }
}
