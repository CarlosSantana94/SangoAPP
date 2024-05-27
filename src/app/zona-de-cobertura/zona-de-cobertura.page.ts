import {Component, OnInit, ViewChild, ElementRef, NgZone} from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions} from '@ionic-native/native-geocoder/ngx';

declare var google;

@Component({
    selector: 'app-zona-de-cobertura',
    templateUrl: './zona-de-cobertura.page.html',
    styleUrls: ['./zona-de-cobertura.page.scss'],
})
export class ZonaDeCoberturaPage implements OnInit {
    @ViewChild('map', {static: false}) mapElement: ElementRef;
    map: any;
    address: string;
    lat: string;
    long: string;
    autocomplete: { input: string; };
    autocompleteItems: any[];
    location: any;
    placeid: any;
    GoogleAutocomplete: any;


    constructor(
        private geolocation: Geolocation,
        private nativeGeocoder: NativeGeocoder,
        public zone: NgZone,
    ) {
        this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
        this.autocomplete = {input: ''};
        this.autocompleteItems = [];
    }

    //  CARGAMOS EL MAPA EN ONINIT
    ngOnInit() {
        this.loadMap();
    }

    //  CARGAR EL MAPA TIENE DOS PARTES
    loadMap() {

        //  OBTENEMOS LAS COORDENADAS DESDE EL TELEFONO.
        this.geolocation.getCurrentPosition().then((resp) => {
            const latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);


            const matrizUbicacion = {lat: 20.663930, lng: -103.414894};
            // Create a bounding box with sides ~30km away from the center point
            const defaultBounds = {
                north: matrizUbicacion.lat + 0.03,
                south: matrizUbicacion.lat - 0.03,
                east: matrizUbicacion.lng + 0.03,
                west: matrizUbicacion.lng - 0.03,
            };

            const mapOptions = {
                center: matrizUbicacion,
                zoom: 13,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };


            //  CUANDO TENEMOS LAS COORDENADAS SIMPLEMENTE NECESITAMOS PASAR AL MAPA DE GOOGLE TODOS LOS PARAMETROS.
            this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
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
                icon: 'assets/imgs/pinMapa.png'
            });


            this.map.addListener('tilesloaded', () => {
                console.log('accuracy', this.map, this.map.center.lat());
                this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng());
                this.lat = this.map.center.lat();
                this.long = this.map.center.lng();
            });


            const zonaDeCoberturaEnMapa = new google.maps.Rectangle({
                strokeColor: '#3560ee',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: 'rgba(149,255,82,0.53)',
                fillOpacity: 0.35,
                map: this.map,
                center: matrizUbicacion,
                bounds: defaultBounds
            });
        }).catch((error) => {
            console.log('Error getting location', error);
        });
    }


    getAddressFromCoords(lattitude, longitude) {
        console.log('getAddressFromCoords ' + lattitude + ' ' + longitude);
        let options: NativeGeocoderOptions = {
            useLocale: true,
            maxResults: 5
        };
        this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
            .then((result: NativeGeocoderResult[]) => {
                this.address = '';
                let responseAddress = [];
                for (let [key, value] of Object.entries(result[0])) {
                    if (value.length > 0) {
                        responseAddress.push(value);
                    }
                }
                responseAddress.reverse();
                for (let value of responseAddress) {
                    this.address += value + ', ';
                }
                this.address = this.address.slice(0, -2);
            })
            .catch((error: any) => {
                this.address = 'Address Not Available!';
            });
    }

    //  FUNCION DEL BOTON INFERIOR PARA QUE NOS DIGA LAS COORDENADAS DEL LUGAR EN EL QUE POSICIONAMOS EL PIN.
    ShowCords() {
        alert('lat' + this.lat + ', long' + this.long);
    }

    //  AUTOCOMPLETE, SIMPLEMENTE ACTUALIZAMOS LA LISTA CON CADA EVENTO DE ION CHANGE EN LA VISTA.
    UpdateSearchResults() {
        if (this.autocomplete.input == '') {
            this.autocompleteItems = [];
            return;
        }
        this.GoogleAutocomplete.getPlacePredictions({input: this.autocomplete.input},
            (predictions, status) => {
                this.autocompleteItems = [];
                this.zone.run(() => {
                    predictions.forEach((prediction) => {
                        this.autocompleteItems.push(prediction);
                    });
                });
            });
    }

    //  FUNCION QUE LLAMAMOS DESDE EL ITEM DE LA LISTA.
    SelectSearchResult(item) {
        //  AQUI PONDREMOS LO QUE QUERAMOS QUE PASE CON EL PLACE ESCOGIDO, GUARDARLO, SUBIRLO A FIRESTORE.
        //  HE AÑADIDO UN ALERT PARA VER EL CONTENIDO QUE NOS OFRECE GOOGLE Y GUARDAMOS EL PLACEID PARA UTILIZARLO POSTERIORMENTE SI QUEREMOS.
        alert(JSON.stringify(item));
        this.placeid = item.place_id;
    }


    //  LLAMAMOS A ESTA FUNCION PARA LIMPIAR LA LISTA CUANDO PULSAMOS IONCLEAR.
    ClearAutocomplete() {
        this.autocompleteItems = [];
        this.autocomplete.input = '';
    }

    //  EJEMPLO PARA IR A UN LUGAR DESDE UN LINK EXTERNO, ABRIR GOOGLE MAPS PARA DIRECCIONES.
    GoTo() {
        return window.location.href = 'https://www.google.com/maps/search/?api=1&query=Google&query_place_id=' + this.placeid;
    }

}
