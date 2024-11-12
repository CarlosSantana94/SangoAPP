import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';

declare const google;


@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.page.html',
  styleUrls: ['./add-address.page.scss'],
})
export class AddAddressPage implements OnInit {
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;
  direccionMapa = ''; // Dirección ingresada por el usuario
  nuevaDireccion = { lat: 0, lng: 0, direccion: '', interior: '', nombre: '', tel: '', cp: '', indicacion: '', alias: '' };
  autocomplete: any;

  // Definición de los límites de la zona de cobertura
  matrizUbicacion = { lat: 20.663930, lng: -103.414894 };
  defaultBounds = {
    north: this.matrizUbicacion.lat + 0.03,
    south: this.matrizUbicacion.lat - 0.03,
    east: this.matrizUbicacion.lng + 0.03,
    west: this.matrizUbicacion.lng - 0.03,
  };
  coverageBounds: any;

  constructor(
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController,
    private zone: NgZone
  ) {}

  async ngOnInit() {
    try {
      // Esperar a que se cargue Google Maps antes de configurar el autocompletado
      await this.loadGoogleMapsScript();
      this.coverageBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(this.defaultBounds.south, this.defaultBounds.west),
        new google.maps.LatLng(this.defaultBounds.north, this.defaultBounds.east)
      );
      this.setupAutocomplete(); // Configura el autocompletado después de cargar el script
    } catch (error) {
      console.error('Error al cargar Google Maps:', error);
    }
  }

  loadGoogleMapsScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window['google'] && window['google'].maps) {
        resolve(); // El script ya está cargado
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = (error) => reject(error);

      document.head.appendChild(script);
    });
  }

  setupAutocomplete() {
    const input = document.getElementById('pac-input') as HTMLInputElement;

    if (!input) {
      console.error('El campo de entrada pac-input no se encuentra en el DOM.');
      return;
    }

    // Configuración de Autocompletado de Google Places
    this.autocomplete = new google.maps.places.Autocomplete(input, {
      bounds: this.coverageBounds,
      strictBounds: true,
      fields: ['formatted_address', 'geometry'],
      types: ['address'],
      componentRestrictions: { country: 'mx' }
    });

    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete.getPlace();

      // Verificar si el lugar tiene geometría y ubicación
      if (place.geometry && place.geometry.location) {
        const lat = typeof place.geometry.location.lat === 'function'
          ? place.geometry.location.lat()
          : place.geometry.location.lat;
        const lng = typeof place.geometry.location.lng === 'function'
          ? place.geometry.location.lng()
          : place.geometry.location.lng;

        if (typeof lat === 'number' && !isNaN(lat) && typeof lng === 'number' && !isNaN(lng)) {
          const location = new google.maps.LatLng(lat, lng);

          if (this.coverageBounds.contains(location)) {
            this.nuevaDireccion.lat = lat;
            this.nuevaDireccion.lng = lng;
            this.nuevaDireccion.direccion = place.formatted_address;
            this.direccionMapa = place.formatted_address;
            console.log('Dirección asignada correctamente:', this.nuevaDireccion);
          } else {
            console.warn('Ubicación fuera de la zona permitida:', { lat, lng });
            this.showOutOfBoundsAlert();
          }
        } else {
          console.error('Latitud o longitud no son números válidos:', { lat, lng });
        }
      } else {
        console.warn('El lugar seleccionado no tiene una ubicación válida o geometría.', place);
      }
    });
  }

  async showOutOfBoundsAlert() {
    const alert = await this.alertController.create({
      header: 'Zona no permitida',
      message: 'La dirección ingresada está fuera de la zona de cobertura permitida. Por favor, elige una dirección válida.',
      buttons: ['OK']
    });
    await alert.present();
  }



async validarCampos() {
    // Verificar si la dirección y campos requeridos están completos
    let mensaje = '';

    if (!this.nuevaDireccion.direccion) mensaje += 'Dirección es requerida. ';
    if (!this.nuevaDireccion.nombre) mensaje += 'Nombre y apellido es requerido. ';
    if (!this.nuevaDireccion.cp) mensaje += 'Código Postal es requerido. ';
    if (!this.nuevaDireccion.tel) mensaje += 'Teléfono es requerido. ';
    if (!this.nuevaDireccion.alias) mensaje += 'Alias es requerido. ';

    if (mensaje) {
      // Muestra mensaje de error si falta algún campo
      const toast = await this.toastController.create({
        message: mensaje,
        color: 'danger',
        duration: 3000
      });
      await toast.present();
    } else {
      // Guardar dirección si todos los campos están completos
      this.guardarDireccion();
    }
  }

  guardarDireccion() {
    console.log('Guardando dirección:', this.nuevaDireccion);
    this.router.navigate(['./select-address']);
  }

  irAZonaDeCobertura() {

  }
}
