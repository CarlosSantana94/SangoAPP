import {CarritoV2} from "./carrito-v2";
import {EstadoPrenda} from "./estado-prenda";
import {SubOpcionesPrenda} from "./sub-opciones-prenda";

export class CarritoItemV2 {
  id: number;
  prenda: SubOpcionesPrenda;
  carrito: CarritoV2;
  cantidad: number;
  estado: EstadoPrenda;

  constructor(
    id: number,
    prenda: SubOpcionesPrenda,
    carrito: CarritoV2,
    cantidad: number,
    estado: EstadoPrenda
  ) {
    this.id = id;
    this.prenda = prenda;
    this.carrito = carrito;
    this.cantidad = cantidad;
    this.estado = estado;
  }
}
