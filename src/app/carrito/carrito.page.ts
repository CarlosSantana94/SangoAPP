import {Component, OnInit} from '@angular/core';
import {RESTService} from '../rest.service';
import {Router} from '@angular/router';

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
                private route: Router) {
    }

    ngOnInit() {
        this.actualizarCantidadPrendas();
    }

    irARecoleccion() {
        this.route.navigate(['/envios']);
    }

    actualizarCantidadPrendas() {
        this.rest.getResumenCarrito().subscribe(data => {
            console.log(data);
            this.resumen = data;
            this.prendas = data.prendasList;
            this.cargando = true;
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
