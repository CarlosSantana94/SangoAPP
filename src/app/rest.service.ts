import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {catchError} from 'rxjs/operators';
import {Observable} from "rxjs";

interface Fecha {
  fecha: string;
  disponibles: number;
  fechaFormat?: string;
}

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

  getEnvios(): Observable<Fecha[]> {
    return this.http.get<Fecha[]>(environment.url + 'envios');
  }

  getEnviosEntrega(fechaSeleccionadaRecoleccion: any): Observable<Fecha[]> {
    return this.http.get<Fecha[]>(environment.url + 'envios/' + fechaSeleccionadaRecoleccion);
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

  postActualizarRecoleccionYEntrega(recoleccion: any, entrega: any, carritoId: any) {
    return this.http.post(environment.url + 'envios/' + recoleccion + '/' + entrega + '?carritoId=' + carritoId, null);
  }

  getResumenCarrito(): any {
    return this.http.get(environment.url + 'carrito/resumen');
  }

  postPagarCarrito(metodo: string, cuandoOToken: string, email: string): any {
    return this.http.post(environment.url + 'carrito/pagar/' + metodo + '/' + cuandoOToken, {email: email});
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

  deleteUsuario(idUsuario: any): any {
    return this.http.delete(environment.url + 'usuario/' + idUsuario);
  }


  // ____________________________________ V2 ______________________________


  getUsuarioV2(idUsuario: any): any {
    return this.http.get(environment.url + 'api/v2/usuarios/' + idUsuario);
  }

  getCarritoNuevo(idUsuario: any): any {
    return this.http.get(environment.url + 'api/v2/carritos/nuevo/' + idUsuario);
  }

  getCarritoNuevoPorUsuarioId(idUsuario: any): any {
    return this.http.get(environment.url + 'api/v2/carritos/nuevo/' + idUsuario);
  }

  getTodosLosCarritos(idUsuario: any): any {
    return this.http.get(environment.url + 'api/v2/carritos/usuario/' + idUsuario);
  }

  postUsuarioV2(usuario: any): any {
    return this.http.post(environment.url + 'api/v2/usuarios', usuario);
  }

  updateUsuarioV2(usuario: any): any {
    return this.http.put(environment.url + 'api/v2/usuarios/' + usuario.id, usuario);
  }

  postActualizarCarritoV2(usuarioId: any, prendaId: any, cantidad: number): any {
    return this.http.post(environment.url + 'api/v2/carritos/' + usuarioId + '/anadir-prenda/' + prendaId + '?cantidad=' + cantidad, null);
  }

  actualizarCantidadDePrendaEnCarrito(carritoId: any, prendaId: any, cantidad: number): any {
    return this.http.post(environment.url + 'api/v2/carritos/' + carritoId + '/actualizar-cantidad/' + prendaId + '?cantidad=' + cantidad, null);
  }

  getResumenCarritoV2(idUsuario: any): any {
    return this.http.get(environment.url + 'api/v2/carritos/' + idUsuario + '/resumen');
  }

  postActualizarDireccionDeCarritoV2(carritoId: any, direccionId: any): any {
    return this.http.post(environment.url + 'api/v2/carritos/' + carritoId + '/direccion/' + direccionId, null);
  }

  postPagarCarritoV2(metodo: any, cuandoOToken: any, email: any): any {
    return this.http.post(environment.url + 'api/v2/carritos/carrito/pagar/' + metodo + '/' + cuandoOToken + '?email=' + email, {email: email});
  }

  getCarritoPorIdV2(idCarrito: any): any {
    return this.http.get(environment.url + 'api/v2/carritos/' + idCarrito);
  }


  deleteDireccion(id): any {

  }

  getDireccionPorId(direccionId: any): any {
    return this.http.get(environment.url + 'direccion/' + direccionId);
  }

  getDeshabilitarDireccion(direccionId: any) {
    return this.http.get(environment.url + 'direccion/disable/' + direccionId);
  }
}
