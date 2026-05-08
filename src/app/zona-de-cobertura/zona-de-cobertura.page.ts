import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { RESTService } from '../rest.service';

declare var google;

@Component({
  selector: 'app-zona-de-cobertura',
  templateUrl: './zona-de-cobertura.page.html',
  styleUrls: ['./zona-de-cobertura.page.scss'],
})
export class ZonaDeCoberturaPage implements OnInit {
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;

  private geofencePolygon: { lat: number; lng: number }[] = [];

  constructor(
    private rest: RESTService,
    public zone: NgZone,
  ) {}

  ngOnInit() {
    this.rest.getConfiguracion().subscribe((config: any) => {
      if (config?.polygonPoints) {
        this.geofencePolygon = JSON.parse(config.polygonPoints);
      }
    });
  }

  ionViewDidEnter() {
    this.loadMap();
  }

  async loadMap() {
    const fallback = { lat: 20.663930, lng: -103.414894 };
    const center = this.geofencePolygon.length
      ? this.geofencePolygon.reduce(
          (acc, p) => ({ lat: acc.lat + p.lat / this.geofencePolygon.length, lng: acc.lng + p.lng / this.geofencePolygon.length }),
          { lat: 0, lng: 0 }
        )
      : fallback;

    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      zoomControl: true,
    });

    if (this.geofencePolygon.length) {
      new google.maps.Polygon({
        map: this.map,
        paths: this.geofencePolygon,
        strokeColor: '#1A6CF5',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#1A6CF5',
        fillOpacity: 0.12,
      });

      const bounds = new google.maps.LatLngBounds();
      this.geofencePolygon.forEach(p => bounds.extend(p));
      this.map.fitBounds(bounds);
    }

    // Try to show user's location — silently skip if denied
    try {
      const permission = await Geolocation.requestPermissions();
      if (permission.location === 'granted') {
        const position = await Geolocation.getCurrentPosition();
        const userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        const userMarker = new google.maps.Marker({
          map: this.map,
          position: userLatLng,
          title: 'Tu ubicación',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#1A6CF5',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
        });
        new google.maps.InfoWindow({ content: '<span style="font-size:13px;font-weight:600">Tu ubicación</span>' })
          .open(this.map, userMarker);
      }
    } catch (_) {}
  }
}
