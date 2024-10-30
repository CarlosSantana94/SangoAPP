import {EstadoPrenda} from "./estado-prenda";
import {OpcionesPrenda} from "./opciones-prenda";

export class SubOpcionesPrenda {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  img: string;
  opcionesPrenda: OpcionesPrenda;
  porMetro: boolean;
  estado: EstadoPrenda;

  constructor(
    id: number,
    nombre: string,
    precio: number,
    descripcion: string,
    img: string,
    opcionesPrenda: OpcionesPrenda,
    porMetro: boolean,
    estado: EstadoPrenda
  ) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.descripcion = descripcion;
    this.img = img;
    this.opcionesPrenda = opcionesPrenda;
    this.porMetro = porMetro;
    this.estado = estado;
  }
}
