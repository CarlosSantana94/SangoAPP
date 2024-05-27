export class OpcionPrenda {

    id: string;
    nombre: string;
    precio: number;
    descripcion: string;
    cantidad: number;
    urlFoto: string;


    constructor(id: string, nombre: string, precio: number, descripcion: string, cantidad: number, urlFoto: string) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.descripcion = descripcion;
        this.cantidad = cantidad;
        this.urlFoto = urlFoto;
    }
}
