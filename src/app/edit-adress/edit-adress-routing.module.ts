import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditAdressPage } from './edit-adress.page';

const routes: Routes = [
  {
    path: '',
    component: EditAdressPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditAdressPageRoutingModule {}
