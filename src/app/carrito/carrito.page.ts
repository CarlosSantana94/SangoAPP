import {Component, OnInit} from '@angular/core';
import {RESTService} from '../rest.service';
import {Router} from '@angular/router';
import {LoadingController} from "@ionic/angular";

@Component({
    selector: 'app-carrito',
    templateUrl: './carrito.page.html',
    styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {

    prendas = [];
    resumen: any = [];
    carrito: any = {};
    cargando: boolean;

    constructor(private rest: RESTService,
                private loadingController: LoadingController,
                private route: Router) {
    }

    ngOnInit() {
        this.actualizarCantidadPrendas();
    }

    irARecoleccion() {
        this.route.navigate(['/envios']);
    }

    async actualizarCantidadPrendas() {
      const loader = await this.loadingController.create({
        message: 'Actualizando Carrito...',
        spinner: 'bubbles', // Optional: 'dots', 'bubbles', etc.
      });
      await loader.present();
        this.rest.getResumenCarrito().subscribe(data => {
            console.log(data);
            this.resumen = data;
            this.prendas = data.prendasList;
            this.cargando = true;
          loader.dismiss();
        });

        this.rest.getCarrito().subscribe(carrito => {
            console.log(carrito);
            this.carrito = carrito;
        });

    }

    agregarPrenda(subPrendaId: number) {
        this.rest.postCarrito(1, subPrendaId).subscribe(data => {
            this.actualizarCantidadPrendas();
        });

    }

    removerPrenda(subPrendaId: number) {
        this.rest.postCarrito(0, subPrendaId).subscribe(data => {
            this.actualizarCantidadPrendas();
        });
    }
}
