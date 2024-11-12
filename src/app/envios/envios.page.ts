import { Component, OnInit } from '@angular/core';
import { RESTService } from '../rest.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

interface Fecha {
  fecha: string;
  disponibles: number;
  fechaFormat?: string;
}

@Component({
  selector: 'app-envios',
  templateUrl: './envios.page.html',
  styleUrls: ['./envios.page.scss'],
})
export class EnviosPage implements OnInit {
  carrito: any = {};
  fechasRecoleccion: Fecha[] = [];
  fechasEntrega: Fecha[] = [];
  fechaRecoleccionSeleccionada: Fecha | null = null; // Cambiado a Fecha | null
  fechaEntregaSeleccionada: Fecha | null = null; // Cambiado a Fecha | null
  carritoId: any;

  constructor(
    private rest: RESTService,
    private loadingController: LoadingController,
    private route: Router
  ) {}

  async ngOnInit() {
    this.carritoId = await this.obtenerCarrito();
    this.fechasRecoleccion = await this.cargarFechasRecoleccion();
  }

  async obtenerCarrito() {
    const userId = localStorage.getItem('uid');
    const data = await this.rest.getCarritoNuevo(userId).toPromise();
    return data.id;
  }

  async cargarFechasRecoleccion(): Promise<Fecha[]> {
    const loader = await this.loadingController.create({
      message: 'Obteniendo fechas de recolección...',
      spinner: 'bubbles',
    });
    await loader.present();
    const data = await this.rest.getEnvios().toPromise() as Fecha[];
    loader.dismiss();
    return data.map((fec: Fecha) => ({
      ...fec,
      fechaFormat: this.formatDate(fec.fecha)
    }));
  }

  formatDate(date: string) {
    return new Date(date).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
    });
  }

  async escogerFechaRecoleccion(fecha: Fecha) {
    this.fechaRecoleccionSeleccionada = fecha;
    this.fechaEntregaSeleccionada = null;
    this.fechasEntrega = await this.cargarFechasEntrega(fecha);
  }

  async cargarFechasEntrega(fechaRecoleccion: Fecha): Promise<Fecha[]> {
    const loader = await this.loadingController.create({
      message: 'Obteniendo fechas de entrega...',
      spinner: 'bubbles',
    });
    await loader.present();
    const data = await this.rest.getEnviosEntrega(fechaRecoleccion.fecha).toPromise() as Fecha[];
    loader.dismiss();
    return data.map((fec: Fecha) => ({
      ...fec,
      fechaFormat: this.formatDate(fec.fecha)
    }));
  }

  async escogerFechaEntrega(fecha: Fecha) {
    this.fechaEntregaSeleccionada = fecha;
    const loader = await this.loadingController.create({
      message: 'Actualizando carrito...',
      spinner: 'bubbles',
    });
    await loader.present();
    await this.rest.postActualizarRecoleccionYEntrega(
      this.fechaRecoleccionSeleccionada!.fecha,
      fecha.fecha,
      this.carritoId
    ).toPromise();
    loader.dismiss();
  }

  irACarrito() {
    this.route.navigate(['/carrito']);
  }

  irADirecciones() {
    this.route.navigate(['./select-address']);
  }
}
