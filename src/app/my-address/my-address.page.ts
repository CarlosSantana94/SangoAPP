import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {RESTService} from '../rest.service';

@Component({
  selector: 'app-my-address',
  templateUrl: './my-address.page.html',
  styleUrls: ['./my-address.page.scss'],
})
export class MyAddressPage implements OnInit {

    direcciones: any = [];
    hayDireccionSeleccionada = false;
    carrito: any = {};

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


    selectAddress(direccion: any) {
        this.rest.postActualizarDireccionEnCarrito(direccion.id).subscribe(data => {
            console.log(data);
            this.hayDireccionSeleccionada = true;
        });
    }
}
