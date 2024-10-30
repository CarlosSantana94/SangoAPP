import {CarritoV2} from "./carrito-v2";

export class UsuarioV2 {
  id: string;
  email: string;
  img?: string;
  nombre?: string;
  password?: string;
  tel?: number;
  token?: string;
  puedePagarConCC: boolean;
  carritos?: CarritoV2[];

  constructor(
    id: string,
    email: string,
    puedePagarConCC: boolean,
    img?: string,
    nombre?: string,
    password?: string,
    tel?: number,
    token?: string,
    carritos?: CarritoV2[]
  ) {
    this.id = id;
    this.email = email;
    this.img = img;
    this.nombre = nombre;
    this.password = password;
    this.tel = tel;
    this.token = token;
    this.puedePagarConCC = puedePagarConCC;
    this.carritos = carritos;
  }
}
