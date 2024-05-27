import {Entrega} from './entrega';

export class CarritoPersonal {
    id: string;
    prendas: any[];
    total: number;
    estadoPedido: string;
    entrega: Entrega;


    constructor() {
        this.total = 0;
        this.estadoPedido = 'Nuevo';
    }
}


