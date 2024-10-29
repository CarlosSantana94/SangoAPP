import {Component, OnInit} from '@angular/core';
import {RESTService} from '../rest.service';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-seccion',
  templateUrl: './seccion.page.html',
  styleUrls: ['./seccion.page.scss'],
})
export class SeccionPage implements OnInit {
  nombreServicio: string;
  idServicio: number;
  opciones: any = [];
  carrito: any = {};
  filteredOpciones: any[] = []; // This will hold the filtered options
  searchText: string = '';

  totalPrendas: number = 0;

  constructor(private rest: RESTService,
              private route: Router,
              private sanitizer: DomSanitizer) {
  }

  ionViewDidEnter() {
    this.rest.getResumenCarritoV2(localStorage.getItem('uid')).subscribe(resumen => {
      this.totalPrendas = resumen.totalPrendas;
    });
  }

  ngOnInit() {
    this.nombreServicio = sessionStorage.getItem('nombreServicio');
    this.idServicio = Number(sessionStorage.getItem('idServicio'));
    this.rest.getOpciones(this.idServicio).subscribe(data => {
      this.opciones = data;
      this.filteredOpciones = this.opciones;
      console.log(this.opciones);
    });

  }

  filterOpciones() {
    this.filteredOpciones = this.opciones.filter(opc =>
      opc.nombre.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  seleccionarOpcionPrenda(opc: any) {
    sessionStorage.setItem('idOpcion', opc.id);
    sessionStorage.setItem('nombreOpcion', opc.nombre);

    this.route.navigate(['./sub-opcion-prenda']);
  }

  goToCart() {
    this.route.navigate(['/carrito']);
  }

  getSantizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + url);
  }
}
