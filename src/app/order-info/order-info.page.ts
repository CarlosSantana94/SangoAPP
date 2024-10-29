import {Component, OnInit} from '@angular/core';
import {RESTService} from '../rest.service';

interface Prenda {
  id: number;
  nombrePrenda: string;
  precioUnitario: number;
  servicio: string;
  nombreCategoria: string;
  subtotal: number;
  img: string;
  cantidad: number;
}

@Component({
  selector: 'app-order-info',
  templateUrl: './order-info.page.html',
  styleUrls: ['./order-info.page.scss'],
})
export class OrderInfoPage implements OnInit {


  prendas: Prenda[] = []; // Array to store the list of "Prendas"
  groupedPrendas: { [servicioPadre: string]: { [servicio: string]: Prenda[] } } = {}; // Grouped by servicioPadre and servicio
  resumen: any = [];
  recogerFecha = '';
  entregarFecha = '';
  fechaCreado = '';
  cargando: boolean = false;
  direccion: any = {};
  elementType = 'url';
  value = 'Techiediaries';
  valorEstrellas: any;
  hayComentario: boolean;
  hayQueja: boolean;
  queja: any;
  comentario: any;
  comentarioExistente: boolean = false;

  constructor(private rest: RESTService) {
  }

  ngOnInit() {

    this.rest.getCarritoPorIdV2(localStorage.getItem('pedidoSeleccionado')).subscribe(data => {
      console.log(data);
      this.resumen = data;
      this.prendas = data.detalles;
      this.recogerFecha = data.envios.fechaRecoleccion;
      this.entregarFecha = data.envios.fechaEntrega;
      this.fechaCreado = data.envios.fechaCreado;
      this.direccion = data.direccion;
      this.groupPrendasByService();

      console.log(data);
      this.rest.getComentarioDeCarrito(data.id)
        .subscribe(data => {
          if (data !== null && data.id !== null) {
            this.comentarioExistente = true;
            this.comentario = data.comentario;
            this.queja = data.queja;
          }
        });
    });
    this.valorEstrellas = 5;
  }

  // Method to group prendas by servicioPadre and servicio
  groupPrendasByService() {
    this.groupedPrendas = this.prendas.reduce(
      (acc: { [servicio: string]: { [nombreCategoria: string]: Prenda[] } }, prenda: Prenda) => {
        if (!acc[prenda.servicio]) {
          acc[prenda.servicio] = {};
        }
        if (!acc[prenda.servicio][prenda.nombreCategoria]) {
          acc[prenda.servicio][prenda.nombreCategoria] = [];
        }
        acc[prenda.servicio][prenda.nombreCategoria].push(prenda);
        return acc;
      },
      {}
    );
    console.log(this.groupedPrendas); // Salida para depuración
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


  calificar(number: number) {
    this.valorEstrellas = number;
  }

  agregarComentario() {
    this.hayComentario = !this.hayComentario;
  }

  agregarQueja() {
    this.hayQueja = !this.hayQueja;
  }

  enviarCalificacion() {
    const current = new Date();
    this.rest.postComentarioChofer({
      idChofer: 1,
      idCarrito: this.resumen.id,
      comentario: this.comentario,
      calificacion: this.valorEstrellas,
      queja: this.queja,
      fecha: current.getTime()
    }).subscribe(data => {
      console.log(data);
    });
  }
}
