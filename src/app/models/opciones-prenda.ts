import {Servicio} from "./servicio";

export class OpcionesPrenda {
  id: number;
  nombre: string;
  img: string;
  servicio: Servicio;

  constructor(
    id: number,
    nombre: string,
    img: string,
    servicio: Servicio
  ) {
    this.id = id;
    this.nombre = nombre;
    this.img = img;
    this.servicio = servicio;
  }
}
