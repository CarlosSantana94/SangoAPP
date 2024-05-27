import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubOpcionPrendaPageRoutingModule } from './sub-opcion-prenda-routing.module';

import { SubOpcionPrendaPage } from './sub-opcion-prenda.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubOpcionPrendaPageRoutingModule
  ],
  declarations: [SubOpcionPrendaPage]
})
export class SubOpcionPrendaPageModule {}
