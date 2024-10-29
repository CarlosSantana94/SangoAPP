import {Component, OnInit} from '@angular/core';
import {RESTService} from '../rest.service';
import {formatDate} from '@angular/common';
import {Router} from '@angular/router';
import {LoadingController} from "@ionic/angular";
import {load} from "@angular-devkit/build-angular/src/utils/server-rendering/esm-in-memory-loader/loader-hooks";

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
  carritoId: any;

  constructor(private rest: RESTService,
              private loadingController: LoadingController,
              private route: Router) {
  }

  ngOnInit() {
    this.rest.getCarritoNuevo(localStorage.getItem('uid')).subscribe(async data => {
      console.log(data);
      this.carritoId = data.id;

      const loader = await this.loadingController.create({
        message: 'Obteniendo Fechas Disponibles para Recolección...',
        spinner: 'bubbles', // Optional: 'dots', 'bubbles', etc.
      });
      await loader.present();
      this.rest.getEnvios().subscribe(data => {
        this.fechasRecoleccion = data;
        loader.dismiss();
        for (const fec of this.fechasRecoleccion) {
          const format = 'EEEE, dd-MMMM';
          const myDate = fec.fecha;
          const locale = 'es-ES';
          const formattedDate = formatDate(myDate, format, locale);

          fec.fechaFormat = formattedDate;
        }

      });
    })


  }

  irADirecciones() {
    this.route.navigate(['./select-address']);
  }

  async escogerFechaRecoleccion(fechaRecoleccionSeleccionada: any) {
    console.log(fechaRecoleccionSeleccionada);
    this.fechasEntrega = [];
    this.fechaEntregaSeleccionada = '';
    const loader = await this.loadingController.create({
      message: 'Obteniendo Fechas Disponibles para Entrega...',
      spinner: 'bubbles', // Optional: 'dots', 'bubbles', etc.
    });
    await loader.present();
    this.rest.getEnviosEntrega(fechaRecoleccionSeleccionada.fecha).subscribe(data => {
      this.fechasEntrega = data;
      loader.dismiss();
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

  async escogerFechaEntrega(fechaEntregaSeleccionada: any) {
    if (fechaEntregaSeleccionada !== '') {
      const loader = await this.loadingController.create({
        message: 'Actualizando Carrito...',
        spinner: 'bubbles', // Optional: 'dots', 'bubbles', etc.
      });
      await loader.present();
      this.rest.postActualizarRecoleccionYEntrega(this.fechaRecoleccionSeleccionada.fecha, fechaEntregaSeleccionada.fecha, this.carritoId).subscribe(data => {
        console.log(data);
        loader.dismiss();
      });
    }
  }

  irACarrito() {
    this.route.navigate(['/carrito']);
  }
}
