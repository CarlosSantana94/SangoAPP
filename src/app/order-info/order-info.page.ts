import { Component, OnInit } from '@angular/core';
import { RESTService } from '../rest.service';

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

interface Comentario {
  id: number;
  idChofer: number;
  idCarrito: number;
  comentario: string | null;
  queja: string | null;
  calificacion: number;
  fecha: string;
}

@Component({
  selector: 'app-order-info',
  templateUrl: './order-info.page.html',
  styleUrls: ['./order-info.page.scss'],
})
export class OrderInfoPage implements OnInit {
  prendas: Prenda[] = [];
  groupedPrendas: { [servicioPadre: string]: { [servicio: string]: Prenda[] } } = {};
  resumen: any = [];
  recogerFecha = '';
  entregarFecha = '';
  fechaCreado = '';
  cargando: boolean = false;
  direccion: any = {};
  elementType = 'url';
  value = 'Techiediaries';
  valorEstrellas: number = 5;
  hayComentario: boolean = false;
  hayQueja: boolean = false;
  queja: string = '';
  comentario: string = '';
  comentarioExistente: Comentario | null = null; // Cambiamos a null y tipo Comentario

  constructor(private rest: RESTService) {}

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

      // Obtenemos el comentario existente
      this.rest.getComentarioDeCarrito(data.id).subscribe(comentarioData => {
        if (comentarioData) {
          this.comentarioExistente = comentarioData;
          // Si existe comentario, establecemos los valores iniciales
          if (this.comentarioExistente) {
            this.valorEstrellas = this.comentarioExistente.calificacion;
            this.comentario = this.comentarioExistente.comentario || '';
            this.queja = this.comentarioExistente.queja || '';
          }
        }
      });
    });
  }

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
    console.log(this.groupedPrendas);
  }

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
        return '';
    }
  }

  getStatusLabel(estado: string): string {
    const labels: { [key: string]: string } = {
      'CREADO': 'Pedido creado',
      'EN_TIENDA': 'En tintorería',
      'TERMINADO': 'Listo para entrega',
      'EN_RUTA_REPARTIDOR': 'En camino',
      'FINALIZADO': 'Entregado',
      'SOLICITA_CANCELACION': 'Cancelación solicitada',
      'CANCELADO': 'Cancelado',
    };
    return labels[estado] || estado;
  }

  getStatusIcon(estado: string): string {
    const icons: { [key: string]: string } = {
      'CREADO': 'receipt-outline',
      'EN_TIENDA': 'business-outline',
      'TERMINADO': 'checkmark-circle-outline',
      'EN_RUTA_REPARTIDOR': 'bicycle-outline',
      'FINALIZADO': 'home-outline',
      'SOLICITA_CANCELACION': 'alert-circle-outline',
      'CANCELADO': 'close-circle-outline',
    };
    return icons[estado] || 'ellipse-outline';
  }

  getStatusKey(estado: string): string {
    const map: { [key: string]: string } = {
      'CREADO': 'created',
      'EN_TIENDA': 'instore',
      'TERMINADO': 'done',
      'EN_RUTA_REPARTIDOR': 'inroute',
      'FINALIZADO': 'delivered',
      'SOLICITA_CANCELACION': 'cancelreq',
      'CANCELADO': 'cancelled',
    };
    return map[estado] || 'created';
  }

  calificar(number: number) {
    // Solo permite calificar si no hay comentario existente
    if (!this.comentarioExistente) {
      this.valorEstrellas = number;
    }
  }

  agregarComentario() {
    // Solo permite agregar comentario si no hay comentario existente
    if (!this.comentarioExistente) {
      this.hayComentario = !this.hayComentario;
      // Si se oculta el campo, limpiamos el comentario
      if (!this.hayComentario) {
        this.comentario = '';
      }
    }
  }

  agregarQueja() {
    // Solo permite agregar queja si no hay comentario existente
    if (!this.comentarioExistente) {
      this.hayQueja = !this.hayQueja;
      // Si se oculta el campo, limpiamos la queja
      if (!this.hayQueja) {
        this.queja = '';
      }
    }
  }

  enviarCalificacion() {
    // Solo permite enviar si no hay comentario existente
    if (!this.comentarioExistente) {
      const current = new Date();
      this.rest.postComentarioChofer({
        idChofer: this.resumen.idRepartidor || 1, // Usamos el id del repartidor del resumen
        idCarrito: this.resumen.id,
        comentario: this.comentario || null,
        calificacion: this.valorEstrellas,
        queja: this.queja || null,
        fecha: current.toISOString()
      }).subscribe(data => {
        console.log('Comentario enviado:', data);
        // Actualizamos el comentario existente con la respuesta
        this.comentarioExistente = data;
        // Mostramos mensaje de éxito
        // Puedes implementar aquí tu sistema de notificaciones
      }, error => {
        console.error('Error al enviar comentario:', error);
        // Mostrar mensaje de error
      });
    }
  }
}
