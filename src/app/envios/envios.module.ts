import { NgModule } from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnviosPageRoutingModule } from './envios-routing.module';

import { EnviosPage } from './envios.page';
import localeES from '@angular/common/locales/es';
registerLocaleData(localeES, 'es');

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnviosPageRoutingModule
  ],
  declarations: [EnviosPage]
})
export class EnviosPageModule {}
