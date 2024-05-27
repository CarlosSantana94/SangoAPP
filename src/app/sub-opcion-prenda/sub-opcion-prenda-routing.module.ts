import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubOpcionPrendaPage } from './sub-opcion-prenda.page';

const routes: Routes = [
  {
    path: '',
    component: SubOpcionPrendaPage
  },
  {
    path: 'modal-imagen',
    loadChildren: () => import('./modal-imagen/modal-imagen.module').then( m => m.ModalImagenPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubOpcionPrendaPageRoutingModule {}
