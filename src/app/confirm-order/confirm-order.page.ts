import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoadingController, ModalController} from '@ionic/angular';
import {RESTService} from '../rest.service';

interface Prenda {
  id: number;
  nombrePrenda: string;
  precioUnitario: number;
  servicio: string;
  nombreCategoria: string;
  subtotal: number;
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
  direccion: any = {};

  constructor(
    private route: Router,
    private modalController: ModalController,
    private rest: RESTService,
    private loadingController: LoadingController
  ) {
  }

  async ngOnInit() {
    this.cargando = false;

    const loader = await this.loadingController.create({
      message: 'Obteniendo Resumen...',
      spinner: 'bubbles', // Optional: 'dots', 'bubbles', etc.
    });
    await loader.present();
    // Fetch data for the summary of the cart
    this.rest.getResumenCarritoV2(localStorage.getItem('uid')).subscribe((data) => {
      loader.dismiss();
      this.resumen = data;
      this.prendas = data.detalles;
      this.recogerFecha = data.envios.fechaRecoleccion;
      this.entregarFecha = data.envios.fechaEntrega;
      this.direccion = data.direccion;
      this.groupPrendasByService(); // Group the prendas by servicioPadre and servicio
      this.cargando = true;
    });
  }

  // Method to group prendas by servicioPadre and servicio
  groupPrendasByService() {
    this.groupedPrendas = this.prendas.reduce(
      (acc: { [servicio: string]: { [nombreCategoria: string]: Prenda[] } }, prenda: Prenda) => {
        if (!acc[prenda.servicio]) {
          acc[prenda.servicio] = {};
        }
        if (!acc[prenda.servicio][prenda.nombreCategoria]) {
          acc[prenda.servicio][prenda.nombreCategoria] = [];
        }
        acc[prenda.servicio][prenda.nombreCategoria].push(prenda);
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
