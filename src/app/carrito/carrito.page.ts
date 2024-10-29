import {Component, OnInit} from '@angular/core';
import {RESTService} from '../rest.service';
import {Router} from '@angular/router';
import {LoadingController} from "@ionic/angular";

interface Prenda {
  nombrePrenda: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  id: number;
  nombreCategoria: string;
  idCategoria: number;
  idServicio: number;
  servicio: string;
  imgPrenda: string;
}

interface GrupoServicio {
  cantidadTotal: number;
  categorias: { [key: string]: Prenda[] };
}

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
  prendas: Prenda[] = [];
  groupedPrendas: { [servicio: string]: GrupoServicio } = {};
  resumen: any = {};
  carrito: any = {};
  cargando: boolean = false;
  totalPrendas: number = 0;

  constructor(
    private rest: RESTService,
    private loadingController: LoadingController,
    private route: Router
  ) {
  }

  ngOnInit() {
    this.obtenerCantidadesEnCarrito();
  }

  ionViewDidEnter() {
    this.obtenerCantidadesEnCarrito();
  }

  obtenerCantidadesEnCarrito() {
    this.cargando = true;
    this.rest.getResumenCarritoV2(localStorage.getItem('uid')).subscribe(resumen => {
      this.carrito = resumen;
      this.totalPrendas = resumen.totalPrendas;

      console.log(this.carrito)

      // Llamar a la función para agrupar prendas por servicio y categoría
      this.groupedPrendas = this.groupByServicioYCategoria(this.carrito.detalles);

      this.cargando = false;
    });
  }

  groupByServicioYCategoria(prendas: Prenda[]): any {
    const grouped = prendas.reduce((result, prenda) => {
      // Agrupar por servicio
      if (!result[prenda.servicio]) {
        result[prenda.servicio] = {
          cantidadTotal: 0,
          categorias: {}
        };
      }

      // Incrementar la cantidad total de prendas por servicio
      result[prenda.servicio].cantidadTotal += prenda.cantidad;

      // Agrupar por categoría dentro del servicio
      if (!result[prenda.servicio].categorias[prenda.nombreCategoria]) {
        result[prenda.servicio].categorias[prenda.nombreCategoria] = [];
      }

      // Agregar la prenda a la categoría correspondiente dentro del servicio
      result[prenda.servicio].categorias[prenda.nombreCategoria].push(prenda);

      return result;
    }, {});

    console.log(grouped)
    return grouped;
  }


  irARecoleccion() {
    this.route.navigate(['/envios']);
  }

  // Método para obtener la clase CSS basada en el nombre del servicio
  getServiceClass(servicio: any): string {
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

  async agregarPrenda(prenda: any) {
    const loader = await this.loadingController.create({
      message: 'Agregando Prenda al Carrito...',
      spinner: 'bubbles', // Optional: 'dots', 'bubbles', etc.
    });
    await loader.present();
    this.rest.postActualizarCarritoV2(localStorage.getItem('uid'), prenda.id, 1).subscribe(data => {
      loader.dismiss();
      this.obtenerCantidadesEnCarrito();
    });
  }

  async removerPrenda(prenda: any) {
    const loader = await this.loadingController.create({
      message: 'Eliminando Prenda al Carrito...',
      spinner: 'bubbles', // Optional: 'dots', 'bubbles', etc.
    });
    await loader.present();
    this.rest.actualizarCantidadDePrendaEnCarrito(this.carrito.id, prenda.id, prenda.cantidad - 1).subscribe(data => {
      loader.dismiss();
      this.obtenerCantidadesEnCarrito();
    });
  }
}
