import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AvisoDePrivacidadPage } from './aviso-de-privacidad.page';

const routes: Routes = [
  {
    path: '',
    component: AvisoDePrivacidadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AvisoDePrivacidadPageRoutingModule {}
