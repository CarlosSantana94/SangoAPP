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

    this.actualizarCantidadPrendas();

    this.rest.getSubOpciones(this.idOpcion).subscribe(data => {
      this.subPrendas = data;
      this.rest.getResumenCarritoV2(localStorage.getItem('uid')).subscribe(resumen => {

        // Recorrer todas las subOpciones (subPrendas)
        this.subPrendas.forEach(subOpcion => {
          // Buscar en los ítems del resumen
          const resumenDetalles = resumen.detalles;

          resumenDetalles.forEach(detalle => {

            console.log(resumen.id);
            console.log(detalle);
            console.log(detalle.id);

            if (detalle.id = subOpcion.id){
              subOpcion.cantidad = detalle.cantidad;
            }
          })


        });
      });

    });


  }

  async agregarPrenda(prenda: any) {
    const loader = await this.loadingController.create({
      message: 'Actualizando Carrito...',
      spinner: 'bubbles', // Optional: 'dots', 'bubbles', etc.
    });
    await loader.present();
    this.rest.postActualizarCarritoV2(localStorage.getItem('uid'), prenda.id, prenda.cantidad + 1).subscribe(data => {
      loader.dismiss();
      // Asegúrate de que 'data' contiene la estructura correcta y 'items' es la lista de ítems del carrito.
      const carritoItems = data.items; // 'items' es el array de ítems del carrito

      // Recorrer todas las subOpciones (subPrendas)
      this.subPrendas.forEach(subOpcion => {
        // Buscar en los ítems del carrito por id de la prenda
        const itemEncontrado = carritoItems.find(item => item.prenda.id === subOpcion.id);

        // Si se encuentra el ítem, actualizamos la cantidad en subOpcion
        if (itemEncontrado) {
          subOpcion.cantidad = itemEncontrado.cantidad;
        }
      });
    });
  }

  async removerPrenda(subPrendaId: number) {
    this.rest.postCarrito(0, subPrendaId).subscribe(data => {
      this.actualizarCantidadPrendas();
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
    this.route.navigate(['/carrito']);
  }

  trackByFn(index: number, item: any): number {
    return item.serialNumber;
  }


  getSantizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + url);
  }
}
