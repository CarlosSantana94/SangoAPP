import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RESTService} from '../rest.service';
import {AlertController, ModalController} from '@ionic/angular';

@Component({
  selector: 'app-my-address',
  templateUrl: './my-address.page.html',
  styleUrls: ['./my-address.page.scss'],
})
export class MyAddressPage implements OnInit {

  direcciones: any = [];
  hayDireccionSeleccionada = false;
  carrito: any = {};

  constructor(
    private route: Router,
    private rest: RESTService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
  ) {
  }

  ngOnInit() {
    this.rest.getResumenCarrito().subscribe(carrito => {
      console.log(carrito);
      this.carrito = carrito;
    });
    this.rest.getDirecciones().subscribe(data => {
      this.direcciones = data;
      console.log(data);
    });
  }

  edit_address(direccionId) {
    sessionStorage.setItem('direccionAEditarId', direccionId)
    this.route.navigate(['./edit-adress']);
  }


  add_address() {
    this.route.navigate(['./add-address']);
  }


  async deleteAddress(direccion: any) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Eliminación',
      message: `¿Estás seguro de que deseas eliminar la dirección: <strong>${direccion.alias}</strong>?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada.');
          },
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.rest.getDeshabilitarDireccion(direccion.id).subscribe(() => {
              this.ngOnInit();
            });
          },
        },
      ],
    });

    await alert.present();
  }


  async showBasicAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Test Alert',
      message: 'This is a test alert.',
      buttons: ['OK'],
    });
    await alert.present();
  }

}
