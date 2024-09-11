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
  }

  async agregarPrenda(subPrendaId: number) {
    this.rest.postCarrito(1, subPrendaId).subscribe(data => {
      this.actualizarCantidadPrendas();
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
