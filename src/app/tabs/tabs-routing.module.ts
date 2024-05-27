import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      // {
      //   path: 'notification',
      //   loadChildren: () => import('../notification/notification.module').then(m => m.NotificationPageModule)
      // },
       {
         path: 'carrito',
         loadChildren: () => import('../carrito/carrito.module').then(m => m.CarritoPageModule)
       },
      // {
      //   path: 'offers',
      //   loadChildren: () => import('../offers/offers.module').then(m => m.OffersPageModule)
      // },  
       {
         path: 'account',
         loadChildren: () => import('../account/account.module').then(m => m.AccountPageModule)
       },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
