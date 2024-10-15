import {Component, OnInit} from '@angular/core';
import {RESTService} from '../rest.service';
import {Router} from '@angular/router';
import {LoadingController} from "@ionic/angular";
import {App as CapacitorApp} from "@capacitor/app";

interface Prenda {
  id: number;
  nombre: string;
  precio: number;
  servicio: string;
  servicioPadre: string;
  precioTotal: number;
  img: string;
  cantidad: number;
}

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
  prendas: Prenda[] = [];
  groupedPrendas: { [servicio: string]: { [servicioPadre: string]: Prenda[] } } = {};
  resumen: any = [];
  carrito: any = {};
  cargando: boolean = false;

  constructor(
    private rest: RESTService,
    private loadingController: LoadingController,
    private route: Router
  ) {
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
      spinner: 'bubbles',
    });
    await loader.present();

    this.rest.getResumenCarrito().subscribe((data) => {
      console.log(data);
      this.resumen = data;
      this.prendas = data.prendasList;
      this.groupPrendasByService(); // Agrupar las prendas por servicio y servicioPadre
      this.cargando = true;
      loader.dismiss();
    });

    this.rest.getCarrito().subscribe((carrito) => {
      console.log(carrito);
      this.carrito = carrito;
    });
  }

  async ionViewDidEnter() {
    // Ejecutar la lógica de actualización de datos cuando la vista ya está cargada
    await this.actualizarCantidadPrendas();
  }

  // Método para agrupar las prendas por servicio y servicioPadre
  groupPrendasByService() {
    this.groupedPrendas = this.prendas.reduce(
      (acc: { [servicio: string]: { [servicioPadre: string]: Prenda[] } }, prenda: Prenda) => {
        if (!acc[prenda.servicio]) {
          acc[prenda.servicio] = {};
        }
        if (!acc[prenda.servicio][prenda.servicioPadre]) {
          acc[prenda.servicio][prenda.servicioPadre] = [];
        }
        acc[prenda.servicio][prenda.servicioPadre].push(prenda);
        return acc;
      },
      {}
    );
    console.log(this.groupedPrendas); // Para depuración
  }

  agregarPrenda(subPrendaId: number) {
    this.rest.postCarrito(1, subPrendaId).subscribe(() => {
      this.actualizarCantidadPrendas();
    });
  }

  removerPrenda(subPrendaId: number) {
    this.rest.postCarrito(0, subPrendaId).subscribe(() => {
      this.actualizarCantidadPrendas();
    });
  }

  // Método para obtener la clase CSS basada en el nombre del servicio
  getServiceClass(servicio: string): string {
    switch (servicio) {
      case 'Tintoreria':
        return 'tintoreria';
      case 'Planchado':
        return 'planchado';
      case 'Lavanderia':
        return 'lavanderia';
      case 'Blancos y Hogar':
        return 'blancos-y-hogar';
      case 'Teñidos':
        return 'teñidos';
      default:
        return ''; // Devuelve una clase vacía si no coincide
    }
  }
}
