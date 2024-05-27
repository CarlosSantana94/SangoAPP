import {Component, OnInit} from '@angular/core';
import {RESTService} from '../rest.service';
import {formatDate} from '@angular/common';
import {Router} from '@angular/router';

@Component({
    selector: 'app-envios',
    templateUrl: './envios.page.html',
    styleUrls: ['./envios.page.scss'],
})
export class EnviosPage implements OnInit {
    carrito: any = {};
    fechasRecoleccion: any = [];
    fechasEntrega: any = [];
    fechaRecoleccionSeleccionada: any = '';
    fechaEntregaSeleccionada: any = '';

    constructor(private rest: RESTService,
                private route: Router) {
    }

    ngOnInit() {
        this.rest.getCarrito().subscribe(carrito => {
            this.carrito = carrito;
        });
        this.rest.getEnvios().subscribe(data => {
            this.fechasRecoleccion = data;

            for (const fec of this.fechasRecoleccion) {
                const format = 'EEEE, dd-MMMM';
                const myDate = fec.fecha;
                const locale = 'es-ES';
                const formattedDate = formatDate(myDate, format, locale);

                fec.fechaFormat = formattedDate;
            }

        });
    }

    irADirecciones() {
        this.route.navigate(['./select-address']);
    }

    escogerFechaRecoleccion(fechaRecoleccionSeleccionada: any) {
        console.log(fechaRecoleccionSeleccionada);
        this.fechasEntrega = [];
        this.fechaEntregaSeleccionada = '';
        this.rest.getEnviosEntrega(fechaRecoleccionSeleccionada.fecha).subscribe(data => {
            this.fechasEntrega = data;
            console.log(this.fechasEntrega);

            for (const fec of this.fechasEntrega) {
                const format = 'EEEE, dd-MMMM';
                const myDate = fec.fecha;
                const locale = 'es-ES';
                const formattedDate = formatDate(myDate, format, locale);

                fec.fechaFormat = formattedDate;
            }
        });

    }

    escogerFechaEntrega(fechaEntregaSeleccionada: any) {
        if (fechaEntregaSeleccionada !== '') {
            this.rest.postActualizarRecoleccionYEntrega(this.fechaRecoleccionSeleccionada.fecha, fechaEntregaSeleccionada.fecha).subscribe(data => {
                console.log(data);
            });
        }
    }

    irACarrito() {
        this.route.navigate(['/carrito']);
    }
}
