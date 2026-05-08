import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
import {AddressTitlePage} from '../address-title/address-title.page';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {RESTService} from '../rest.service';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions} from '@ionic-native/native-geocoder/ngx';

declare const google;

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.page.html',
  styleUrls: ['./add-address.page.scss'],
})
export class AddAddressPage implements OnInit {
  locations: Observable<any>;
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('visibleMap') visibleMapElement: ElementRef;

  map: any;
  markers = [];
  visibleMap: any;
  draggableMarker: any;

  private geofencePolygon: { lat: number; lng: number }[] = [];

  // ── Split-search state ───────────────────────────────────────
  calle: string = '';
  numero: string = '';
  suggestions: any[] = [];
  noNumberError: boolean = false;
  fueraDeCobertura: boolean = false;
  debounceTimer: any = null;
  autocompleteService: any = null;
  placesService: any = null;

  nuevaDireccion = {
    direccion: '',
    nombre: '',
    tel: '',
    cp: '',
    indicacion: '',
    alias: '',
    lat: 0,
    lng: 0,
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
  direccionMapa = '';

  constructor(private modalController: ModalController,
              private rest: RESTService,
              private route: Router,
              private geolocation: Geolocation,
              private nativeGeocoder: NativeGeocoder,
              public zone: NgZone,
              private alertController: AlertController,
  ) {}

  ngOnInit() {
    this.rest.getConfiguracion().subscribe((config: any) => {
      if (config?.polygonPoints) {
        this.geofencePolygon = JSON.parse(config.polygonPoints);
      }
    });
    setTimeout(() => { this.loadMap(); }, 1500);
  }

  async loadMap() {
    const centerFallback = { lat: 20.663930, lng: -103.414894 };
    let coordinates = this.geofencePolygon.length
      ? this.geofencePolygon.reduce((acc, p) => ({ lat: acc.lat + p.lat / this.geofencePolygon.length, lng: acc.lng + p.lng / this.geofencePolygon.length }), { lat: 0, lng: 0 })
      : centerFallback;

    this.geolocation.getCurrentPosition().then((resp) => {
      coordinates = {lat: resp.coords.latitude, lng: resp.coords.longitude};
    }).catch(() => {});

    const latLng = new google.maps.LatLng(coordinates.lat, coordinates.lng);

    const mapOptions = {
      center: latLng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    // Use AutocompleteService + PlacesService for custom two-field search
    this.autocompleteService = new google.maps.places.AutocompleteService();
    this.placesService = new google.maps.places.PlacesService(this.map);
  }

  // Combined query from calle + numero
  get searchQuery(): string {
    const c = this.calle.trim();
    const n = this.numero.trim();
    return n ? `${c} ${n}` : c;
  }

  // Called on input change in either calle or numero fields
  buscarDirecciones() {
    this.noNumberError = false;

    // Clear previous selection when user edits the street
    if (this.nuevaDireccion.lat !== 0) {
      this.clearSeleccion();
    }

    if (this.calle.trim().length < 3 || !this.autocompleteService) {
      this.suggestions = [];
      return;
    }

    if (this.debounceTimer) clearTimeout(this.debounceTimer);

    this.debounceTimer = setTimeout(() => {
      const request: any = {
        input: this.searchQuery,
        componentRestrictions: { country: 'mx' },
        types: ['address'],
      };

      if (this.geofencePolygon.length) {
        const lats = this.geofencePolygon.map(p => p.lat);
        const lngs = this.geofencePolygon.map(p => p.lng);
        request.bounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(Math.min(...lats), Math.min(...lngs)),
          new google.maps.LatLng(Math.max(...lats), Math.max(...lngs))
        );
        request.strictBounds = true;
      }

      this.autocompleteService.getPlacePredictions(request, (predictions: any[], status: string) => {
        this.zone.run(() => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            this.suggestions = predictions;
          } else {
            this.suggestions = [];
          }
        });
      });
    }, 350);
  }

  // Called when user taps a suggestion from the list
  seleccionarSugerencia(sugerencia: any) {
    if (!this.placesService) return;
    this.suggestions = [];

    this.placesService.getDetails(
      {placeId: sugerencia.place_id, fields: ['geometry', 'formatted_address', 'address_components']},
      (place: any, status: string) => {
        this.zone.run(() => {
          if (status !== google.maps.places.PlacesServiceStatus.OK || !place) return;

          // Check for street_number in Google's address components
          const streetNumComp = place.address_components?.find(
            (c: any) => c.types.includes('street_number')
          );

          // No number from Google AND user hasn't typed one → block and ask for number
          if (!streetNumComp && !this.numero.trim()) {
            this.noNumberError = true;
            return;
          }

          // Validate that the address falls inside the geofence circle
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          if (!this.dentroDeGeofence(lat, lng)) {
            this.fueraDeCobertura = true;
            return;
          }

          // Capture lat/lng and formatted address
          this.fueraDeCobertura = false;
          this.nuevaDireccion.lat = lat;
          this.nuevaDireccion.lng = lng;
          this.direccionMapa = place.formatted_address || sugerencia.description;
          this.initVisibleMap();

          // Auto-fill numero field from Google if user hadn't typed one
          if (streetNumComp && !this.numero.trim()) {
            this.numero = streetNumComp.long_name;
          }
        });
      }
    );
  }

  private dentroDeGeofence(lat: number, lng: number): boolean {
    const poly = this.geofencePolygon;
    if (!poly.length) { return true; }
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const iLat = poly[i].lat, iLng = poly[i].lng;
      const jLat = poly[j].lat, jLng = poly[j].lng;
      if (((iLng > lng) !== (jLng > lng)) &&
          (lat < (jLat - iLat) * (lng - iLng) / (jLng - iLng) + iLat)) {
        inside = !inside;
      }
    }
    return inside;
  }

  // Reset address selection so user can start over
  clearSeleccion() {
    this.nuevaDireccion.lat = 0;
    this.nuevaDireccion.lng = 0;
    this.direccionMapa = '';
    this.noNumberError = false;
    this.fueraDeCobertura = false;
    this.suggestions = [];
    if (this.draggableMarker) {
      this.draggableMarker.setMap(null);
      this.draggableMarker = null;
    }
    this.visibleMap = null;
  }

  initVisibleMap() {
    setTimeout(() => {
      if (!this.visibleMapElement?.nativeElement) { return; }
      const center = { lat: this.nuevaDireccion.lat, lng: this.nuevaDireccion.lng };

      this.visibleMap = new google.maps.Map(this.visibleMapElement.nativeElement, {
        center,
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        zoomControl: true,
      });

      this.draggableMarker = new google.maps.Marker({
        position: center,
        map: this.visibleMap,
        draggable: true,
        animation: google.maps.Animation.DROP,
      });

      this.draggableMarker.addListener('dragend', (event: any) => {
        const newLat = event.latLng.lat();
        const newLng = event.latLng.lng();
        this.zone.run(() => { this.confirmarNuevaUbicacion(newLat, newLng); });
      });
    }, 300);
  }

  async confirmarNuevaUbicacion(newLat: number, newLng: number) {
    const prevLat = this.nuevaDireccion.lat;
    const prevLng = this.nuevaDireccion.lng;

    const alert = await this.alertController.create({
      header: 'Confirmar ubicación',
      message: '¿Quieres usar esta posición como tu dirección exacta?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.draggableMarker.setPosition({ lat: prevLat, lng: prevLng });
            this.visibleMap.panTo({ lat: prevLat, lng: prevLng });
          },
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.nuevaDireccion.lat = newLat;
            this.nuevaDireccion.lng = newLng;
          },
        },
      ],
    });
    await alert.present();
  }

  address_title() {
    this.modalController.create({component: AddressTitlePage}).then((modalElement) => {
      modalElement.present();
    });
  }

  validarCampos() {
    let existeError = false;

    this.nuevaDireccionColores = {
      nombreCompleto: 'dark',
      direccion: 'dark',
      numero: 'black',
      tel: 'black',
      cp: 'black',
      alias: 'black',
    };

    this.nuevaDireccion.direccion = this.direccionMapa;

    if (this.nuevaDireccion.nombre === '') {
      this.nuevaDireccionColores.nombreCompleto = 'danger';
      existeError = true;
    }
    if (this.nuevaDireccion.cp === '') {
      this.nuevaDireccionColores.cp = 'danger';
      existeError = true;
    }
    if (this.nuevaDireccion.tel === '') {
      this.nuevaDireccionColores.tel = 'danger';
      existeError = true;
    }
    if (this.nuevaDireccion.alias === '') {
      this.nuevaDireccionColores.alias = 'danger';
      existeError = true;
    }

    if (!existeError) {
      this.rest.postDireccion(this.nuevaDireccion).subscribe(data => {
        console.log(data);
        this.select_address();
      });
    }
  }

  select_address() {
    this.route.navigate(['./select-address']).then(() => {
      window.location.reload();
    });
  }

  irAZonaDeCobertura() {
    this.route.navigate(['./zona-de-cobertura']);
  }
}
