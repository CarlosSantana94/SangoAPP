import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {RESTService} from '../rest.service';

interface Prenda {
  id: number;
  nombre: string;
  precio: number;
  servicio: string;
  servicioPadre: string;
  precioTotal: number;
  img: string;
  cantidad: number;
}

@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.page.html',
  styleUrls: ['./confirm-order.page.scss'],
})
export class ConfirmOrderPage implements OnInit {
  prendas: Prenda[] = []; // Array to store the list of "Prendas"
  groupedPrendas: { [servicioPadre: string]: { [servicio: string]: Prenda[] } } = {}; // Grouped by servicioPadre and servicio
  resumen: any = [];
  recogerFecha = '';
  entregarFecha = '';
  cargando: boolean = false;

  constructor(
    private route: Router,
    private modalController: ModalController,
    private rest: RESTService
  ) {
  }

  ngOnInit() {
    this.cargando = false;

    // Fetch data for the summary of the cart
    this.rest.getResumenCarrito().subscribe((data) => {
      console.log(data);
      this.resumen = data;
      this.prendas = data.prendasList;
      this.groupPrendasByService(); // Group the prendas by servicioPadre and servicio
      this.cargando = true;
    });
  }

  // Method to group prendas by servicioPadre and servicio
  groupPrendasByService() {
    this.groupedPrendas = this.prendas.reduce(
      (acc: { [servicio: string]: { [servicioPadre: string]: Prenda[] } }, prenda: Prenda) => {
        if (!acc[prenda.servicio]) {
          acc[prenda.servicio] = {};
        }
        if (!acc[prenda.servicio][prenda.servicioPadre]) {
          acc[prenda.servicio][prenda.servicioPadre] = [];
        }
        acc[prenda.servicio][prenda.servicioPadre].push(prenda);
        return acc;
      },
      {}
    );
    console.log(this.groupedPrendas); // Salida para depuración
  }

  // Navigate to the payment page
  payment() {
    this.route.navigate(['./payment']);
  }

  // Método para obtener la clase CSS basada en el nombre del servicio
  getServiceClass(servicio: string): string {
    switch (servicio) {
      case 'Tintoreria':
        return 'tintoreria';
      case 'Planchado':
        return 'planchado';
      case 'Lavanderia':
        return 'lavanderia';
      case 'Blancos y Hogar':
        return 'blancos-y-hogar';
      case 'Teñidos':
        return 'teñidos';
      default:
        return ''; // Devuelve una clase vacía si no coincide
    }
  }
}
