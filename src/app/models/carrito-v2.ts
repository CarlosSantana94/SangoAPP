import {UsuarioV2} from "./usuario-v2";
import {EstadoCarrito} from "./estado-carrito";
import {CarritoItemV2} from "./carrito-item-v2";

export class CarritoV2 {
  id: number;
  usuario: UsuarioV2;
  estado: EstadoCarrito;
  fechaCreacion: Date;
  fechaRecoleccion: Date;
  items: CarritoItemV2[];

  constructor(
    id: number,
    usuario: UsuarioV2,
    estado: EstadoCarrito,
    fechaCreacion: Date,
    fechaRecoleccion: Date,
    items: CarritoItemV2[]
  ) {
    this.id = id;
    this.usuario = usuario;
    this.estado = estado;
    this.fechaCreacion = fechaCreacion;
    this.fechaRecoleccion = fechaRecoleccion;
    this.items = items;
  }
}
