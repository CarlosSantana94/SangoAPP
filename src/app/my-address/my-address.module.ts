import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { MyAddressPageRoutingModule } from './my-address-routing.module';

import { MyAddressPage } from './my-address.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,   
    MyAddressPageRoutingModule
  ],
  declarations: [MyAddressPage]
})
export class MyAddressPageModule {}
