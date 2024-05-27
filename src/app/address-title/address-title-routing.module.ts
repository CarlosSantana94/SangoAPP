import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddressTitlePage } from './address-title.page';

const routes: Routes = [
  {
    path: '',
    component: AddressTitlePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddressTitlePageRoutingModule {}
