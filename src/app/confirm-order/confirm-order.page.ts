import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {RESTService} from '../rest.service';

@Component({
    selector: 'app-confirm-order',
    templateUrl: './confirm-order.page.html',
    styleUrls: ['./confirm-order.page.scss'],
})
export class ConfirmOrderPage implements OnInit {
  prendas = [];
  groupedPrendas = {}; // Nuevo objeto para agrupar prendas por servicio
  resumen: any = [];
  recogerFecha = '';
  entregarFecha = '';
  cargando: boolean;

  constructor(private route: Router, private modalController: ModalController,
              private rest: RESTService) {
  }

  ngOnInit() {
    this.cargando = false;

    this.rest.getResumenCarrito().subscribe(data => {
      console.log(data);
      this.resumen = data;
      this.prendas = data.prendasList;
      this.groupPrendasByService();
      this.cargando = true;
    });
  }

  // Método para agrupar prendas por servicio
  groupPrendasByService() {
    this.groupedPrendas = this.prendas.reduce((acc, prenda) => {
      if (!acc[prenda.servicio]) {
        acc[prenda.servicio] = [];
      }
      acc[prenda.servicio].push(prenda);
      return acc;
    }, {});
  }

  payment() {
    this.route.navigate(['./payment']);
  }
}

