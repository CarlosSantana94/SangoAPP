import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AvisoDePrivacidadPageRoutingModule } from './aviso-de-privacidad-routing.module';

import { AvisoDePrivacidadPage } from './aviso-de-privacidad.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AvisoDePrivacidadPageRoutingModule
  ],
  declarations: [AvisoDePrivacidadPage]
})
export class AvisoDePrivacidadPageModule {}
