import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RESTService} from '../rest.service';

@Component({
    selector: 'app-select-address',
    templateUrl: './select-address.page.html',
    styleUrls: ['./select-address.page.scss'],
})
export class SelectAddressPage implements OnInit {
    direcciones: any = [];
    hayDireccionSeleccionada = false;
    carrito: any = {};
    direccionSeleccionada : any;

    constructor(private route: Router,
                private rest: RESTService) {
    }

    ngOnInit() {
        this.rest.getResumenCarrito().subscribe(carrito => {
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

    selectAddress(direccion: any) {
        this.rest.postActualizarDireccionEnCarrito(direccion.id).subscribe(data => {
            console.log(data);
            this.direccionSeleccionada = direccion;
            console.log(direccion);
            
            this.hayDireccionSeleccionada = true;
        });
    }
}
