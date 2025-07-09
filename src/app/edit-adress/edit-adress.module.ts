import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditAdressPageRoutingModule } from './edit-adress-routing.module';

import { EditAdressPage } from './edit-adress.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditAdressPageRoutingModule
  ],
  declarations: [EditAdressPage]
})
export class EditAdressPageModule {}
