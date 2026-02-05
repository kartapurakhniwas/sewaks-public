import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './layout/login/login.component';
import { MasterComponent } from './layout/master/master.component';
import { PublicComponent } from './layout/public/public.component';

const routes: Routes = [
  {
    path: '',
    component: PublicComponent,
    data: { title: ' Sewaks - Home' },
    loadChildren: () =>
      import('./components/homepage/_module').then(
        (m) => m.HomepageModule
      ),
  },

  {
    path: 'admin/dashboard',
    component: MasterComponent,
    data: { title: ' Sewaks - Dashboard' },
    loadChildren: () =>
      import('./components/admin/dashboard/_module').then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: 'admin/volunteers',
    component: MasterComponent,
    data: { title: ' Sewaks - Volunteers' },
    loadChildren: () =>
      import('./components/admin/volunteers/_module').then(
        (m) => m.VolunteersModule
      ),
  },
  {
    path: 'admin/contact-us-list',
    component: MasterComponent,
    data: { title: ' Sewaks - Contact Us List' },
    loadChildren: () =>
      import('./components/admin/contact-us/_module').then(
        (m) => m.JoinUsFormModule
      ),
  },
  {
    path: 'admin/bills',
    component: MasterComponent,
    data: { title: ' Sewaks - Bills' },
    loadChildren: () =>
      import('./components/admin/bills/_module').then(
        (m) => m.BillsModule
      ),
  },
  {
    path: 'admin/suppliers',
    component: MasterComponent,
    data: { title: ' Sewaks - Suppliers' },
    loadChildren: () =>
      import('./components/admin/suppliers/_module').then(
        (m) => m.SuppliersModule
      ),
  },
  {
    path: 'admin/donations',
    component: MasterComponent,
    data: { title: ' Sewaks - Donations' },
    loadChildren: () =>
      import('./components/admin/donations/_module').then(
        (m) => m.DonationsModule
      ),
  },
  {
    path: 'admin/xlsx',
    component: MasterComponent,
    data: { title: ' Sewaks - Donations' },
    loadChildren: () =>
      import('./components/admin/debit-list-xlsx/_module').then(
        (m) => m.DebitListModule
      ),
  },
  {
    path: 'admin/donatins-xlsx',
    component: MasterComponent,
    data: { title: ' Sewaks - Donations' },
    loadChildren: () =>
      import('./components/admin/credit-list-xlsx/_module').then(
        (m) => m.CreditListModule
      ),
  },
  {
    path: 'admin/voucher-category',
    component: MasterComponent,
    data: { title: ' Sewaks - Voucher Category' },
    loadChildren: () =>
      import('./components/admin/voucher-category/_module').then(
        (m) => m.VoucherCategoryModule
      ),
  },
  {
    path: 'admin/vouchers',
    component: MasterComponent,
    data: { title: ' Sewaks - Vouchers' },
    loadChildren: () =>
      import('./components/admin/vouchers/_module').then(
        (m) => m.VouchersModule
      ),
  },




  {
    path: 'account',
    component: PublicComponent,
    data: { title: ' Sewaks - Login' },
    loadChildren: () =>
      import('./components/user/_module').then(
        (m) => m.UserModule
      ),
  },
  {
    path: 'about',
    component: PublicComponent,
    data: { title: ' Sewaks - About Us' },
    loadChildren: () =>
      import('./components/about-us/_module').then(
        (m) => m.AboutUsModule
      ),
  },
  {
    path: 'donation',
    component: PublicComponent,
    data: { title: ' Sewaks - Donation' },
    loadChildren: () =>
      import('./components/donation/_module').then(
        (m) => m.DonationModule
      ),
  },
  {
    path: 'volunteers',
    component: PublicComponent,
    data: { title: ' Sewaks - Volunteers' },
    loadChildren: () =>
      import('./components/volunteers/_module').then(
        (m) => m.VolunteersModule
      ),
  },
  {
    path: 'causes',
    component: PublicComponent,
    data: { title: ' Sewaks - Causes' },
    loadChildren: () =>
      import('./components/causes/_module').then(
        (m) => m.CausesModule
      ),
  },
  {
    path: 'gallery',
    component: PublicComponent,
    data: { title: ' Sewaks - Gallery' },
    loadChildren: () =>
      import('./components/gallery/_module').then(
        (m) => m.GalleryModule
      ),
  },
  {
    path: 'faq',
    component: PublicComponent,
    data: { title: ' Sewaks - Faq' },
    loadChildren: () =>
      import('./components/faq/_module').then(
        (m) => m.FaqModule
      ),
  },
  {
    path: 'user',
    component: PublicComponent,
    data: { title: ' Sewaks - User' },
    loadChildren: () =>
      import('./components/user/_module').then(
        (m) => m.UserModule
      ),
  },
  {
    path: 'events',
    component: PublicComponent,
    data: { title: ' Sewaks - Events' },
    loadChildren: () =>
      import('./components/events/_module').then(
        (m) => m.EventsModule
      ),
  },
  {
    path: 'testimonials',
    component: PublicComponent,
    data: { title: ' Sewaks - Testimonials' },
    loadChildren: () =>
      import('./components/testimonials/_module').then(
        (m) => m.TestimonialsModule
      ),
  },
  {
    path: 'privacy',
    component: PublicComponent,
    data: { title: ' Sewaks - Privacy' },
    loadChildren: () =>
      import('./components/privacy/_module').then(
        (m) => m.PrivacyModule
      ),
  },
  {
    path: 'terms',
    component: PublicComponent,
    data: { title: ' Sewaks - Terms' },
    loadChildren: () =>
      import('./components/terms/_module').then(
        (m) => m.TermsModule
      ),
  },
  {
    path: 'commingsoon',
    component: PublicComponent,
    data: { title: ' Sewaks - Commingsoon' },
    loadChildren: () =>
      import('./components/commingsoon/_module').then(
        (m) => m.CommingsoonModule
      ),
  },
  {
    path: 'nofound',
    component: PublicComponent,
    data: { title: ' Sewaks - Nofound' },
    loadChildren: () =>
      import('./components/404/_module').then(
        (m) => m.NotFoundModule
      ),
  },
  {
    path: 'blog',
    component: PublicComponent,
    data: { title: ' Sewaks - Blog' },
    loadChildren: () =>
      import('./components/blog/_module').then(
        (m) => m.BlogModule
      ),
  },
  {
    path: 'blogdetail',
    component: PublicComponent,
    data: { title: ' Sewaks - Blogdetail' },
    loadChildren: () =>
      import('./components/blog-detail/_module').then(
        (m) => m.BlogdetailModule
      ),
  },
  {
    path: 'contact',
    component: PublicComponent,
    data: { title: ' Sewaks - Contact' },
    loadChildren: () =>
      import('./components/contact/_module').then(
        (m) => m.ContactModule
      ),
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: ' Sewaks - Contact' },

  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
