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
    this.rest.getServicios().subscribe(data => {
      this.servicios = data;
    });
  }

  seleccionarSeccion(seccion: string) {
    const idServicio = this.servicios.find(element => element.nombre === seccion);
    console.log(idServicio);
    sessionStorage.setItem('idServicio', idServicio.id);
    sessionStorage.setItem('nombreServicio', idServicio.nombre);
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
