import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/sign-in',
    pathMatch: 'full'
  },

  // ── Rutas públicas (sin login) ─────────────────────────────
  {
    path: 'sign-in',
    loadChildren: () => import('./sign-in/sign-in.module').then(m => m.SignInPageModule)
  },
  {
    path: 'servicios-sin-cuenta',
    loadChildren: () => import('./servicios-sin-cuenta/servicios-sin-cuenta.module').then(m => m.ServiciosSinCuentaPageModule)
  },

  // ── Rutas protegidas (requieren login) ─────────────────────
  {
    path: '',
    canActivate: [authGuard],
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'carrito',
    canActivate: [authGuard],
    loadChildren: () => import('./carrito/carrito.module').then(m => m.CarritoPageModule)
  },
  {
    path: 'confirm-order',
    canActivate: [authGuard],
    loadChildren: () => import('./confirm-order/confirm-order.module').then(m => m.ConfirmOrderPageModule)
  },
  {
    path: 'payment',
    canActivate: [authGuard],
    loadChildren: () => import('./payment/payment.module').then(m => m.PaymentPageModule)
  },
  {
    path: 'order-info',
    canActivate: [authGuard],
    loadChildren: () => import('./order-info/order-info.module').then(m => m.OrderInfoPageModule)
  },
  {
    path: 'account',
    canActivate: [authGuard],
    loadChildren: () => import('./account/account.module').then(m => m.AccountPageModule)
  },
  {
    path: 'my-profile',
    canActivate: [authGuard],
    loadChildren: () => import('./my-profile/my-profile.module').then(m => m.MyProfilePageModule)
  },
  {
    path: 'add-address',
    canActivate: [authGuard],
    loadChildren: () => import('./add-address/add-address.module').then(m => m.AddAddressPageModule)
  },
  {
    path: 'my-address',
    canActivate: [authGuard],
    loadChildren: () => import('./my-address/my-address.module').then(m => m.MyAddressPageModule)
  },
  {
    path: 'faq',
    canActivate: [authGuard],
    loadChildren: () => import('./faq/faq.module').then(m => m.FaqPageModule)
  },
  {
    path: 'contact-us',
    canActivate: [authGuard],
    loadChildren: () => import('./contact-us/contact-us.module').then(m => m.ContactUsPageModule)
  },
  {
    path: 'terms-conditions',
    canActivate: [authGuard],
    loadChildren: () => import('./terms-conditions/terms-conditions.module').then(m => m.TermsConditionsPageModule)
  },
  {
    path: 'address-title',
    canActivate: [authGuard],
    loadChildren: () => import('./address-title/address-title.module').then(m => m.AddressTitlePageModule)
  },
  {
    path: 'my-orders',
    canActivate: [authGuard],
    loadChildren: () => import('./my-orders/my-orders.module').then(m => m.MyOrdersPageModule)
  },
  {
    path: 'select-address',
    canActivate: [authGuard],
    loadChildren: () => import('./select-address/select-address.module').then(m => m.SelectAddressPageModule)
  },
  {
    path: 'seccion',
    canActivate: [authGuard],
    loadChildren: () => import('./seccion/seccion.module').then(m => m.SeccionPageModule)
  },
  {
    path: 'sub-opcion-prenda',
    canActivate: [authGuard],
    loadChildren: () => import('./sub-opcion-prenda/sub-opcion-prenda.module').then(m => m.SubOpcionPrendaPageModule)
  },
  {
    path: 'envios',
    canActivate: [authGuard],
    loadChildren: () => import('./envios/envios.module').then(m => m.EnviosPageModule)
  },
  {
    path: 'zona-de-cobertura',
    canActivate: [authGuard],
    loadChildren: () => import('./zona-de-cobertura/zona-de-cobertura.module').then(m => m.ZonaDeCoberturaPageModule)
  },
  {
    path: 'aviso-de-privacidad',
    canActivate: [authGuard],
    loadChildren: () => import('./aviso-de-privacidad/aviso-de-privacidad.module').then(m => m.AvisoDePrivacidadPageModule)
  },
  {
    path: 'delete-account',
    canActivate: [authGuard],
    loadChildren: () => import('./delete-account/delete-account.module').then(m => m.DeleteAccountPageModule)
  },
  {
    path: 'edit-adress',
    canActivate: [authGuard],
    loadChildren: () => import('./edit-adress/edit-adress.module').then(m => m.EditAdressPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppRoutingModule {}
