import * as uuid from 'uuid';

export class  Entrega{
    id: string;
    diaRecogida: string;
    horaRecogida: string;
    diaEntrega: string;
    horaEntrega: string;


    constructor() {
        this.id = uuid.v4();
    }
}
