import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {AddressTitlePage} from '../address-title/address-title.page';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {RESTService} from '../rest.service';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions} from '@ionic-native/native-geocoder/ngx';
import {resize} from "ionicons/icons";

declare const google;

@Component({
  selector: 'app-edit-adress',
  templateUrl: './edit-adress.page.html',
  styleUrls: ['./edit-adress.page.scss'],
})
export class EditAdressPage implements OnInit {
  locations: Observable<any>;
  // Map related
  @ViewChild('map') mapElement: ElementRef;
  nuevaDireccion = {
    direccion: '',
    nombre: '',
    tel: '',
    cp: '',
    indicacion: '',
    alias: '',
    interior: ''
  };
  nuevaDireccionColores = {
    nombreCompleto: 'dark',
    direccion: 'black',
    numero: 'black',
    tel: 'black',
    cp: 'black',
    alias: 'black',
  };
  errorMessage: string = '';


  constructor(
    private rest: RESTService,
    private route: Router,
    public zone: NgZone,
  ) {

  }

  ngOnInit() {

    this.rest.getDireccionPorId(sessionStorage.getItem('direccionAEditarId')).subscribe(data => {
      console.log(data);
      this.nuevaDireccion = data;
    })


  }


  irAZonaDeCobertura() {
    this.route.navigate(['./zona-de-cobertura']);
  }

  actualizarDireccion() {
    // Validación de campos vacíos
    if (!this.nuevaDireccion.direccion ||
      !this.nuevaDireccion.nombre ||
      !this.nuevaDireccion.cp ||
      !this.nuevaDireccion.tel ||
      !this.nuevaDireccion.alias) {
      this.errorMessage = 'Por favor, completa todos los campos obligatorios. ';
      return;
    }
    this.rest.postDireccion(this.nuevaDireccion).subscribe(data => {
      console.log(data);
    });
  }
}
