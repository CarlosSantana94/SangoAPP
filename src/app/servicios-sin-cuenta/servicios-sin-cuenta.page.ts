import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {RESTService} from "../rest.service";
import {CallNumber} from "@awesome-cordova-plugins/call-number/ngx";

@Component({
  selector: 'app-servicios-sin-cuenta',
  templateUrl: './servicios-sin-cuenta.page.html',
  styleUrls: ['./servicios-sin-cuenta.page.scss'],
})
export class ServiciosSinCuentaPage implements OnInit {

  servicios: any = [];

  constructor(private route: Router,
              private rest: RESTService,
              private callNumber: CallNumber) {
  }

  ngOnInit() {
    this.rest.getServicios().subscribe((data: any) => {
      this.servicios = (data || []).sort((a, b) => a.id - b.id);
    });
  }

  /** Imagen local de respaldo por servicio (diseño original). */
  private readonly imgsRespaldo: { [id: number]: string } = {
    1: 'assets/imgs/portadas-06.jpg',
    2: 'assets/imgs/portadas-05.jpg',
    3: 'assets/imgs/portadas-02.jpg',
    4: 'assets/imgs/portadas-04.jpg',
    5: 'assets/imgs/portadas-03.jpg',
  };

  imgDe(servicio: any): string {
    return servicio.img || this.imgsRespaldo[servicio.id] || 'assets/imgs/portadas-06.jpg';
  }

  seleccionarSeccion(servicio: any) {
    sessionStorage.setItem('idServicio', String(servicio.id));
    sessionStorage.setItem('nombreServicio', servicio.nombre);
    this.route.navigate(['./seccion']);
  }

  llamar() {
    this.callNumber.callNumber('3331221189', true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  login() {
    this.route.navigate(['./sign-in']);
  }
}
