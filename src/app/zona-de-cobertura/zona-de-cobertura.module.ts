import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ZonaDeCoberturaPageRoutingModule } from './zona-de-cobertura-routing.module';

import { ZonaDeCoberturaPage } from './zona-de-cobertura.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ZonaDeCoberturaPageRoutingModule
  ],
  declarations: [ZonaDeCoberturaPage]
})
export class ZonaDeCoberturaPageModule {}
