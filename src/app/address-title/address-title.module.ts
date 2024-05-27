import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
      
import { IonicModule } from '@ionic/angular';

import { AddressTitlePageRoutingModule } from './address-title-routing.module';

import { AddressTitlePage } from './address-title.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule, 
    AddressTitlePageRoutingModule
  ],
  declarations: [AddressTitlePage]
})
export class AddressTitlePageModule {}
