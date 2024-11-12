// zona-de-cobertura.page.ts
import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@capacitor/geolocation';

declare var google;

@Component({
  selector: 'app-zona-de-cobertura',
  templateUrl: './zona-de-cobertura.page.html',
  styleUrls: ['./zona-de-cobertura.page.scss'],
})
export class ZonaDeCoberturaPage implements OnInit {
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;
  address: string;
  lat: string;
  long: string;
  coverageMessage: string = 'Solo la zona mostrada en verde tiene cobertura SANGO';
  GoogleAutocomplete: any;

  constructor(
    private nativeGeocoder: NativeGeocoder,
    public zone: NgZone,
  ) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
  }

  ngOnInit() {
    // Additional initialization logic if needed
  }

  ionViewDidEnter() {
    this.loadMap();
  }

  async loadMap() {
    try {
      const permission = await Geolocation.requestPermissions();
      if (permission.location === 'granted') {
        const position = await Geolocation.getCurrentPosition();

        const latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        const matrizUbicacion = { lat: 20.663930, lng: -103.414894 };

        const defaultBounds = {
          north: matrizUbicacion.lat + 0.03,
          south: matrizUbicacion.lat - 0.03,
          east: matrizUbicacion.lng + 0.03,
          west: matrizUbicacion.lng - 0.03,
        };

        const mapOptions = {
          center: matrizUbicacion,
          zoom: 13,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
        };

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        // Add marker for the current location
        const userMarker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: latLng,
        });

        // Show an info window for the user's location
        const infoWindow = new google.maps.InfoWindow({
          content: `<h5>Tu Ubicación</h5>`,
        });
        infoWindow.open(this.map, userMarker);

        // Add marker for the defined center (coverage zone)
        new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: matrizUbicacion,
          icon: 'assets/imgs/pinMapa.png',
        });

        // Add rectangle overlay to define the coverage area
        new google.maps.Rectangle({
          strokeColor: '#3560ee',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#95ff52',
          fillOpacity: 0.35,
          map: this.map,
          bounds: defaultBounds,
        });

        // Display the coverage message at the top of the map
        const coverageDiv = document.createElement('div');
        coverageDiv.style.backgroundColor = 'rgba(0,0,0,0.9)';
        coverageDiv.style.color = 'white';
        coverageDiv.style.padding = '10px';
        coverageDiv.style.margin = '50px';
        coverageDiv.style.borderRadius = '4px';
        coverageDiv.innerText = this.coverageMessage;
        this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(coverageDiv);

        // Fetch the address of the user's location
        this.getAddressFromCoords(position.coords.latitude, position.coords.longitude);
      } else {
        console.error('Location permission not granted');
      }
    } catch (error) {
      console.error('Error requesting location permission or getting position', error);
    }
  }

  getAddressFromCoords(latitude, longitude) {
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5,
    };
    this.nativeGeocoder.reverseGeocode(latitude, longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        this.address = '';
        let responseAddress = [];
        for (let [key, value] of Object.entries(result[0])) {
          if (value.length > 0) {
            responseAddress.push(value);
          }
        }
        responseAddress.reverse();
        this.address = responseAddress.join(', ');

        // Update info window content with the fetched address
        const infoWindow = new google.maps.InfoWindow({
          content: `<h5>Your Location</h5><p>${this.address}</p>`,
        });
        infoWindow.setPosition({ lat: latitude, lng: longitude });
        infoWindow.open(this.map);
      })
      .catch((error: any) => {
        this.address = 'Address Not Available!';
      });
  }

  ShowCords() {
    alert('lat: ' + this.lat + ', long: ' + this.long);
  }
}
