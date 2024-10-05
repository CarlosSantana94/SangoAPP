import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RESTService {

  constructor(private http: HttpClient) {
  }

  getHealth(): any {
    return this.http.get(environment.url + 'health');
  }

  getServicios() {
    return this.http.get(environment.url + 'servicios');
  }

  getOpciones(servicioId: number) {
    return this.http.get(environment.url + 'opciones/' + servicioId);
  }

  getSubOpciones(opcionId: number) {
    return this.http.get(environment.url + 'subOpciones/' + opcionId);
  }

  postUsuario(usuario: any): any {
    return this.http.post(environment.url + 'usuario', usuario);
  }

  getCarrito() {
    return this.http.get(environment.url + 'carrito');
  }

  postCarrito(agregar: number, subPrendaId: number) {
    return this.http.post(environment.url + 'carrito/' + agregar + '/' + subPrendaId, {});
  }

  getEnvios() {
    return this.http.get(environment.url + 'envios');
  }

  getEnviosEntrega(fechaSeleccionadaRecoleccion: any) {
    return this.http.get(environment.url + 'envios/' + fechaSeleccionadaRecoleccion);
  }

  getDirecciones() {
    return this.http.get(environment.url + 'direccion/lista');
  }

  postDireccion(direccion: any) {
    return this.http.post(environment.url + 'direccion', direccion);
  }

  postActualizarDireccionEnCarrito(idDireccion: number) {
    return this.http.post(environment.url + 'carrito/direccion/' + idDireccion, {test: 'test'});
  }

  postActualizarRecoleccionYEntrega(recoleccion: any, entrega: any) {
    return this.http.post(environment.url + 'envios/' + recoleccion + '/' + entrega, {test: 'test'});
  }

  getResumenCarrito(): any {
    return this.http.get(environment.url + 'carrito/resumen');
  }

  postPagarCarrito(metodo: string, cuandoOToken: string): any {
    return this.http.post(environment.url + 'carrito/pagar/' + metodo + '/' + cuandoOToken, {});
  }

  getPedidos(): any {
    return this.http.get(environment.url + 'carrito/pedidos');
  }

  getCarritoPorId(idCarrito: any): any {
    return this.http.get(environment.url + 'carrito/id/' + idCarrito);
  }

  postComentarioChofer(comentarioChofer: any): any {
    return this.http.post(environment.url + 'repartidor/comentario', comentarioChofer);
  }

  getComentarioDeCarrito(idCarrito: any): any {
    return this.http.get(environment.url + 'repartidor/comentario/existente/' + idCarrito);
  }

  getUsuario(idUsuario: any): any {

    return this.http.get(environment.url + 'usuario/' + idUsuario);
  }
}
