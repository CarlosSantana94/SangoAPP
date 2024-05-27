import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
        path: '',
        redirectTo: '/sign-in',
        pathMatch: 'full'
    },
    {
        path: 'sign-in',
        loadChildren: () => import('./sign-in/sign-in.module').then(m => m.SignInPageModule)
    },
    {
      path: '',
      loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
},

{
  path: 'carrito',
  loadChildren: () => import('./carrito/carrito.module').then(m => m.CarritoPageModule)
},

// {
//     path: 'resiter-now',
//     loadChildren: () => import('./resiter-now/resiter-now.module').then(m => m.ResiterNowPageModule)
// },
// {
//     path: 'forgot-password',
//     loadChildren: () => import('./forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)
// },
// {
//     path: 'verification',
//     loadChildren: () => import('./verification/verification.module').then(m => m.VerificationPageModule)
// },
// {
//     path: 'home',
//     loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
// },
 {
     path: 'confirm-order',
     loadChildren: () => import('./confirm-order/confirm-order.module').then(m => m.ConfirmOrderPageModule)
 },
// {
//     path: 'select-time',
//     loadChildren: () => import('./select-time/select-time.module').then(m => m.SelectTimePageModule)
// },
 {
     path: 'payment',
     loadChildren: () => import('./payment/payment.module').then(m => m.PaymentPageModule)
 },
 {
     path: 'order-info',
     loadChildren: () => import('./order-info/order-info.module').then(m => m.OrderInfoPageModule)
 },
// {
//     path: 'offers',
//     loadChildren: () => import('./offers/offers.module').then(m => m.OffersPageModule)
// },
 {
     path: 'account',
     loadChildren: () => import('./account/account.module').then(m => m.AccountPageModule)
 },
// {
//     path: 'my-profile',
//     loadChildren: () => import('./my-profile/my-profile.module').then(m => m.MyProfilePageModule)
// },
 {
     path: 'add-address',
     loadChildren: () => import('./add-address/add-address.module').then(m => m.AddAddressPageModule)
 },
 {
     path: 'my-address',
     loadChildren: () => import('./my-address/my-address.module').then(m => m.MyAddressPageModule)
 },
 {
     path: 'faq',
     loadChildren: () => import('./faq/faq.module').then(m => m.FaqPageModule)
 },
 {
     path: 'contact-us',
     loadChildren: () => import('./contact-us/contact-us.module').then(m => m.ContactUsPageModule)
 },
 {
     path: 'terms-conditions',
     loadChildren: () => import('./terms-conditions/terms-conditions.module').then(m => m.TermsConditionsPageModule)
 },
// {
//     path: 'chat',
//     loadChildren: () => import('./chat/chat.module').then(m => m.ChatPageModule)
// },
{
     path: 'address-title',
     loadChildren: () => import('./address-title/address-title.module').then(m => m.AddressTitlePageModule)
 },
// {
//     path: 'notification',
//     loadChildren: () => import('./notification/notification.module').then(m => m.NotificationPageModule)
// },
{
     path: 'my-orders',
     loadChildren: () => import('./my-orders/my-orders.module').then(m => m.MyOrdersPageModule)
 },
// {
//     path: 'change-language',
//     loadChildren: () => import('./change-language/change-language.module').then(m => m.ChangeLanguagePageModule)
// },
// {
//     path: 'promocode',
//     loadChildren: () => import('./promocode/promocode.module').then(m => m.PromocodePageModule)
// },
// {
//     path: 'select-task',
//     loadChildren: () => import('./select-task/select-task.module').then(m => m.SelectTaskPageModule)
// },
// {
//     path: 'cart',
//     loadChildren: () => import('./cart/cart.module').then(m => m.CartPageModule)
// },
 {
     path: 'select-address',
     loadChildren: () => import('./select-address/select-address.module').then(m => m.SelectAddressPageModule)
 },
// {
//     path: 'buyappalert',
//     loadChildren: () => import('./buyappalert/buyappalert.module').then(m => m.BuyappalertPageModule)
// },
// {
//     path: 'contact-us2',
//     loadChildren: () => import('./contact-us2/contact-us2.module').then(m => m.ContactUs2PageModule)
// },
// {
//     path: 'planchado',
//     loadChildren: () => import('./planchado/planchado.module').then(m => m.PlanchadoPageModule)
// },
 {
     path: 'seccion',
     loadChildren: () => import('./seccion/seccion.module').then(m => m.SeccionPageModule)
 },
 {
     path: 'sub-opcion-prenda',
     loadChildren: () => import('./sub-opcion-prenda/sub-opcion-prenda.module').then(m => m.SubOpcionPrendaPageModule)
 },
 {
    path: 'envios',
     loadChildren: () => import('./envios/envios.module').then(m => m.EnviosPageModule)
 },
 {
     path: 'zona-de-cobertura',
     loadChildren: () => import('./zona-de-cobertura/zona-de-cobertura.module').then(m => m.ZonaDeCoberturaPageModule)
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
