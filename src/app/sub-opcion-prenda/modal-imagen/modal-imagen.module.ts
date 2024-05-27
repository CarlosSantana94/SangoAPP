import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ModalImagenPageRoutingModule} from './modal-imagen-routing.module';

import {ModalImagenPage} from './modal-imagen.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ModalImagenPageRoutingModule
    ],
    declarations: [ModalImagenPage,
        ModalImagenPage]
})
export class ModalImagenPageModule {
}
