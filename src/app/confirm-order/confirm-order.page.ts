import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {RESTService} from '../rest.service';

@Component({
    selector: 'app-confirm-order',
    templateUrl: './confirm-order.page.html',
    styleUrls: ['./confirm-order.page.scss'],
})
export class ConfirmOrderPage implements OnInit {
    prendas = [];
    resumen: any = [];
    recogerFecha = '';
    entregarFecha = '';

    cargando: boolean;

    constructor(private route: Router, private modalController: ModalController,
                private rest: RESTService) {
    }

    ngOnInit() {
        this.cargando = false;

        this.rest.getResumenCarrito().subscribe(data => {
            console.log(data);
            this.resumen = data;
            this.prendas = data.prendasList;
            this.cargando = true;
        });

    }

    payment() {
        this.route.navigate(['./payment']);
    }


}
