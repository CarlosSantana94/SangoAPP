import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {ModalController} from '@ionic/angular';
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
    // Map related
    @ViewChild('map') mapElement: ElementRef;


    map: any;
    markers = [];
    direccionABuscar: string;

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
    ) {

    }

    ngOnInit() {
        setTimeout(() => {
            this.loadMap();
        }, 1500);

    }

    async loadMap() {
        /*Geolocation.requestPermissions().then(p => {
            console.log(p);
        }).catch(e => {
            console.log(e);
        });*/
        let coordinates = {lat: 20.663930, lng: -103.414894};
        this.geolocation.getCurrentPosition().then((resp) => {
            coordinates = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
        });
        console.log('Current position:', coordinates);
        if (coordinates) {
            const latLng = new google.maps.LatLng(coordinates.lat, coordinates.lng);

            const matrizUbicacion = {lat: 20.663930, lng: -103.414894};
            // Create a bounding box with sides ~30km away from the center point
            const defaultBounds = {
                north: matrizUbicacion.lat + 0.03,
                south: matrizUbicacion.lat - 0.03,
                east: matrizUbicacion.lng + 0.03,
                west: matrizUbicacion.lng - 0.03,
            };


            const mapOptions = {
                center: latLng,
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                strictBounds: true,
                bounds: defaultBounds,
            };

            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);


            const markerLocal = new google.maps.Marker({
                map: this.map,
                animation: google.maps.Animation.DROP,
                position: latLng
            });


            const matrizMarker = new google.maps.Marker({
                map: this.map,
                animation: google.maps.Animation.DROP,
                position: matrizUbicacion,
                icon: 'assets/imgs/logo_sango_mini.png'
            });

            const cityCircle = new google.maps.Rectangle({
                strokeColor: '#3560ee',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: 'rgba(149,255,82,0.53)',
                fillOpacity: 0.35,
                map: this.map,
                center: matrizUbicacion,
                bounds: defaultBounds
            });


            markerLocal.setMap(this.map);
            matrizMarker.setMap(this.map);
            const input = document.getElementById('pac-input') as HTMLInputElement;


            const options = {
                fields: ['formatted_address', 'geometry', 'name'],
                strictBounds: true,
                bounds: defaultBounds,
                types: ['address'],
                componentRestrictions: {
                    country: ['mx']
                }
            };


            const autocomplete = new google.maps.places.Autocomplete(input, options);


            autocomplete.addListener('place_changed', () => {

                markerLocal.setVisible(false);
                const place = autocomplete.getPlace();

                if (!place.geometry || !place.geometry.location) {
                    // User entered the name of a Place that was not suggested and
                    // pressed the Enter key, or the Place Details request failed.
                    window.alert('No details available for input: \'' + place.name + '\'');
                    return;
                }
                this.nuevaDireccion.lat = place.geometry.location.lat();
                this.nuevaDireccion.lng = place.geometry.location.lng();

                // If the place has a geometry, then present it on a map.
                if (place.geometry.viewport) {
                    this.map.fitBounds(place.geometry.viewport);
                } else {
                    this.map.setCenter(place.geometry.location);
                    this.map.setZoom(17);
                }
                markerLocal.setPosition(place.geometry.location);
                markerLocal.setVisible(true);

                console.log(place.geometry.location);

                console.log(this.nuevaDireccion);

                this.direccionMapa = input.value;
                console.log(this.direccionMapa);
            });
        }
    }


    address_title() {
        this.modalController.create({component: AddressTitlePage}).then((modalElement) => {
                modalElement.present();
            }
        );
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

        console.log(this.nuevaDireccion);

        if (!existeError) {
            this.rest.postDireccion(this.nuevaDireccion).subscribe(data => {
                console.log(data);
                this.select_address();
            });
        } else {
            console.log('error');
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
