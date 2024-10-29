import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RESTService} from '../rest.service';
import {LoadingController} from "@ionic/angular";
import {load} from "@angular-devkit/build-angular/src/utils/server-rendering/esm-in-memory-loader/loader-hooks";

@Component({
  selector: 'app-select-address',
  templateUrl: './select-address.page.html',
  styleUrls: ['./select-address.page.scss'],
})
export class SelectAddressPage implements OnInit {
  direcciones: any = [];
  hayDireccionSeleccionada = false;
  carrito: any = {};
  direccionSeleccionada: any;

  constructor(private route: Router,
              private rest: RESTService,
              private loadingController: LoadingController
  ) {
  }

  ngOnInit() {
    this.rest.getResumenCarritoV2(localStorage.getItem('uid')).subscribe(carrito => {
      console.log(carrito);
      this.carrito = carrito;
    });
    this.rest.getDirecciones().subscribe(data => {
      this.direcciones = data;
      console.log(data);
    });
  }

  add_address() {
    this.route.navigate(['./add-address']);
  }

  confirm_order() {
    this.route.navigate(['./confirm-order']);
  }


  async selectAddress(direccion: any) {
    const loader = await this.loadingController.create({
      message: 'Actualizando Direccion En El Pedido...',
      spinner: 'bubbles', // Optional: 'dots', 'bubbles', etc.
    });
    await loader.present();

    this.rest.postActualizarDireccionDeCarritoV2(this.carrito.id, direccion.id).subscribe(data => {
      console.log(data);
      loader.dismiss();
      this.direccionSeleccionada = direccion;
      console.log(direccion);

      this.hayDireccionSeleccionada = true;
    });
  }
}
