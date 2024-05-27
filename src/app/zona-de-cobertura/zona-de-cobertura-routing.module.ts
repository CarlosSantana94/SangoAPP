import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ZonaDeCoberturaPage } from './zona-de-cobertura.page';

const routes: Routes = [
  {
    path: '',
    component: ZonaDeCoberturaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ZonaDeCoberturaPageRoutingModule {}
