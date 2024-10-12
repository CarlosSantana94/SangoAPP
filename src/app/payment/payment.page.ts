import {Component, OnInit} from '@angular/core';
import {AlertController, LoadingController, NavController} from '@ionic/angular';
import {RESTService} from '../rest.service';
import {Router} from '@angular/router';


declare const Conekta;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  total = 0;
  metodo = '';
  private pagando = false;

  tarjeta = {
    card: {
      number: '',
      name: '',
      exp_year: 2026,
      exp_month: '12',
      cvc: ''
    }
  };

  tokenC = '';
  meses = [];
  anios = [];
  cuandoEfectivo: any;
  puedePagarConCC = false;
  carrito: any = {};
  email: any;
  isEmailValid: boolean = true;


  constructor(private navCtrl: NavController,
              public alertController: AlertController,
              private loadingController: LoadingController,
              private route: Router,
              public rest: RESTService) {

    this.rest.getUsuario(localStorage.getItem('uid')).subscribe(u => {
      localStorage.setItem("puedePagarCC", u.puedePagarConCC);
      this.puedePagarConCC = u.puedePagarConCC;

      this.email = localStorage.getItem("email");
      if (this.email == 'null') {
        this.email = '';
      }



      if (!this.puedePagarConCC) {
        this.seleccionarMetodo('tarjeta');
      }

      this.rest.getResumenCarrito().subscribe(data => {
        console.log(data);
        this.carrito = data;
      });
    });


  }

  ngOnInit() {
    this.cuandoEfectivo = '';
    Conekta.setPublicKey('key_OMk8qnxSgVCZnq411H1ME6w');

    this.meses = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

    let year = (new Date()).getFullYear();
    this.anios.push(year);

    for (let i = 0; i <= 12; i++) {
      this.anios.push(year++);
    }


  }

  tabs() {
    this.route.navigate(['./tabs']);
    sessionStorage.setItem('actualizarHome', 'si');
  }

  generarToken() {
    const successResponseHandler = success => {
      // Do something on sucess
      // you need to send the token to the backend.
      this.tokenC = success.id;
      this.presentAlertPagar('Confirmar Pago con Tarjeta', 'Total a pagar: $' + this.carrito.total);
    };

    const errorResponseHandler = error => {
      // Do something on error
      console.log(error)
      this.presentAlertError('Error en la tarjeta', error.message_to_purchaser);
    };

    Conekta.Token.create(this.tarjeta, successResponseHandler, errorResponseHandler);

  }

  async presentAlertPagar(titulo: string, mensaje: string) {
    if (mensaje === '') {
      mensaje = 'Validar datos de la tarjeta';
    }

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: titulo,
      message: mensaje,
      buttons: [{text: 'Cancelar', role: 'cancel', cssClass: 'secondary'}, {
        text: 'Confirmar', handler: () => {
          this.cerrarPedido();
        }
      }]
    });

    alert.present();
  }

  async presentAlertError(titulo: string, mensaje: string) {
    if (mensaje === '') {
      mensaje = 'Validar datos de la tarjeta';
    }

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: titulo,
      message: mensaje,
      buttons: [{text: 'Ok', role: 'cancel', cssClass: 'secondary'}]
    });

    alert.present();
  }


  seleccionarMetodo(sel: string) {
    this.metodo = sel;
  }

  seleccionarCuandoEfectivo(value: string) {
    console.log('Selected value:', value);
    this.cuandoEfectivo = value;
  }

  pagarEnEfectivo() {
    if (this.cuandoEfectivo === 'entregar') {
      this.presentAlertPagar('¿Cerrar Pedido?', 'Al presionar pagar, se generará tu orden.' +
        '\nEl pago lo harás cuando te recojan el pedido');
    } else if (this.cuandoEfectivo === 'recibir') {
      this.presentAlertPagar('¿Cerrar Pedido?', 'Al presionar pagar, se generará tu orden.' +
        '\nEl pago lo harás cuando se te entregue tu ropa');
    }
  }

  async cerrarPedido() {
    const loader = await this.loadingController.create({
      message: 'Pagando y creando pedido...',
      spinner: 'bubbles', // Optional: 'dots', 'bubbles', etc.
    });
    await loader.present();

    if (this.metodo === 'efectivo') {
      this.rest.postPagarCarrito(this.metodo, this.cuandoEfectivo, '').subscribe(data => {
        if (!data.hayError) {
          this.rest.getCarrito().subscribe(a => {
            console.log(a);
            loader.dismiss();
            this.tabs();
          });
        } else {
          this.presentAlertError('Sucedio un error en su pedido', data.mensaje);
        }
      });
    } else if (this.metodo === 'tarjeta') {
      this.rest.postPagarCarrito(this.metodo, this.tokenC, localStorage.getItem('email')).subscribe(data => {
        console.log(data);
        if (!data.hayError) {
          this.rest.getCarrito().subscribe(a => {
            console.log(a);
            loader.dismiss();
            this.tabs();
          });

        } else {
          loader.dismiss();
          this.presentAlertError('Sucedio un error en su pago', data.mensaje);
        }
      });
    }
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  // Method to validate the email
  validateEmail() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.isEmailValid = emailRegex.test(this.email);
  }

}
