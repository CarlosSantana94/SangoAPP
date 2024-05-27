import {Component, OnInit} from '@angular/core';
import {RESTService} from '../rest.service';

@Component({
    selector: 'app-order-info',
    templateUrl: './order-info.page.html',
    styleUrls: ['./order-info.page.scss'],
})
export class OrderInfoPage implements OnInit {


    prendas = [];
    resumen: any = [];
    recogerFecha = '';
    entregarFecha = '';
    elementType = 'url';
    value = 'Techiediaries';
    valorEstrellas: any;
    hayComentario: boolean;
    hayQueja: boolean;
    queja: any;
    comentario: any;
    comentarioExistente: boolean = false;


    constructor(private rest: RESTService) {
    }

    ngOnInit() {


        this.rest.getCarritoPorId(localStorage.getItem('pedidoSeleccionado')).subscribe(data => {
            console.log(data);
            this.resumen = data;
            this.prendas = data.prendasList;
        

            this.rest.getComentarioDeCarrito(data.id).subscribe(data => {
                console.log(data);
                if (data.id !== null) {
                    this.comentarioExistente = true;
                    this.comentario=data.comentario;
                    this.queja=data.queja;
                }
            });
        });
        this.valorEstrellas = 5;
    }

    calificar(number: number) {
        this.valorEstrellas = number;
    }

    agregarComentario() {
        this.hayComentario = !this.hayComentario;
    }

    agregarQueja() {
        this.hayQueja = !this.hayQueja;
    }

    enviarCalificacion() {
        const current = new Date();
        this.rest.postComentarioChofer({
            idChofer: 1,
            idCarrito: this.resumen.id,
            comentario: this.comentario,
            calificacion: this.valorEstrellas,
            queja: this.queja,
            fecha: current.getTime()
        }).subscribe(data => {
            console.log(data);
        });
    }
}
