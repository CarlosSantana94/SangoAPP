import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiciosSinCuentaPage } from './servicios-sin-cuenta.page';

const routes: Routes = [
  {
    path: '',
    component: ServiciosSinCuentaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiciosSinCuentaPageRoutingModule {}
