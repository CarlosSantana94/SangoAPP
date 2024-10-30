import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiciosSinCuentaPageRoutingModule } from './servicios-sin-cuenta-routing.module';

import { ServiciosSinCuentaPage } from './servicios-sin-cuenta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiciosSinCuentaPageRoutingModule
  ],
  declarations: [ServiciosSinCuentaPage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ServiciosSinCuentaPageModule {}
