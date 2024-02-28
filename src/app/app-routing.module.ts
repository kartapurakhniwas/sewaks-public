import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicComponent } from './layout/public/public.component';
import { LoginComponent } from './layout/login/login.component';
import { MasterComponent } from './layout/master/master.component';

const routes: Routes = [
  {
    path: '',
    component: PublicComponent,
    data: { title: ' ALS - Home' },
    loadChildren: () =>
      import('./components/homepage/_module').then(
        (m) => m.HomepageModule
      ),
  },
  
  {
    path: 'admin/dashboard',
    component: MasterComponent,
    data: { title: ' ALS - Dashboard' },
    loadChildren: () =>
      import('./components/admin/dashboard/_module').then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: 'admin/volunteers',
    component: MasterComponent,
    data: { title: ' ALS - Volunteers' },
    loadChildren: () =>
      import('./components/admin/volunteers/_module').then(
        (m) => m.VolunteersModule
      ),
  },
  {
    path: 'admin/contact-us-list',
    component: MasterComponent,
    data: { title: ' ALS - Contact Us List' },
    loadChildren: () =>
      import('./components/admin/contact-us/_module').then(
        (m) => m.JoinUsFormModule
      ),
  },
  {
    path: 'admin/bills',
    component: MasterComponent,
    data: { title: ' ALS - Bills' },
    loadChildren: () =>
      import('./components/admin/bills/_module').then(
        (m) => m.BillsModule
      ),
  },
  {
    path: 'admin/donations',
    component: MasterComponent,
    data: { title: ' ALS - Donations' },
    loadChildren: () =>
      import('./components/admin/donations/_module').then(
        (m) => m.DonationsModule
      ),
  },
  {
    path: 'admin/xlsx',
    component: MasterComponent,
    data: { title: ' ALS - Donations' },
    loadChildren: () =>
      import('./components/admin/debit-list-xlsx/_module').then(
        (m) => m.DebitListModule
      ),
  },
  {
    path: 'admin/donatins-xlsx',
    component: MasterComponent,
    data: { title: ' ALS - Donations' },
    loadChildren: () =>
      import('./components/admin/credit-list-xlsx/_module').then(
        (m) => m.CreditListModule
      ),
  },
  
  


  {
    path: 'account',
    component: PublicComponent,
    data: { title: ' ALS - Login' },
    loadChildren: () =>
      import('./components/user/_module').then(
        (m) => m.UserModule
      ),
  },
  {
    path: 'about',
    component: PublicComponent,
    data: { title: ' ALS - About Us' },
    loadChildren: () =>
      import('./components/about-us/_module').then(
        (m) => m.AboutUsModule
      ),
  },
  {
    path: 'donation',
    component: PublicComponent,
    data: { title: ' ALS - Donation' },
    loadChildren: () =>
      import('./components/donation/_module').then(
        (m) => m.DonationModule
      ),
  },
  {
    path: 'volunteers',
    component: PublicComponent,
    data: { title: ' ALS - Volunteers' },
    loadChildren: () =>
      import('./components/volunteers/_module').then(
        (m) => m.VolunteersModule
      ),
  },
  {
    path: 'causes',
    component: PublicComponent,
    data: { title: ' ALS - Causes' },
    loadChildren: () =>
      import('./components/causes/_module').then(
        (m) => m.CausesModule
      ),
  },
  {
    path: 'gallery',
    component: PublicComponent,
    data: { title: ' ALS - Gallery' },
    loadChildren: () =>
      import('./components/gallery/_module').then(
        (m) => m.GalleryModule
      ),
  },
  {
    path: 'faq',
    component: PublicComponent,
    data: { title: ' ALS - Faq' },
    loadChildren: () =>
      import('./components/faq/_module').then(
        (m) => m.FaqModule
      ),
  },
  {
    path: 'user',
    component: PublicComponent,
    data: { title: ' ALS - User' },
    loadChildren: () =>
      import('./components/user/_module').then(
        (m) => m.UserModule
      ),
  },
  {
    path: 'events',
    component: PublicComponent,
    data: { title: ' ALS - Events' },
    loadChildren: () =>
      import('./components/events/_module').then(
        (m) => m.EventsModule
      ),
  },
  {
    path: 'testimonials',
    component: PublicComponent,
    data: { title: ' ALS - Testimonials' },
    loadChildren: () =>
      import('./components/testimonials/_module').then(
        (m) => m.TestimonialsModule
      ),
  },
  {
    path: 'privacy',
    component: PublicComponent,
    data: { title: ' ALS - Privacy' },
    loadChildren: () =>
      import('./components/privacy/_module').then(
        (m) => m.PrivacyModule
      ),
  },
  {
    path: 'terms',
    component: PublicComponent,
    data: { title: ' ALS - Terms' },
    loadChildren: () =>
      import('./components/terms/_module').then(
        (m) => m.TermsModule
      ),
  },
  {
    path: 'commingsoon',
    component: PublicComponent,
    data: { title: ' ALS - Commingsoon' },
    loadChildren: () =>
      import('./components/commingsoon/_module').then(
        (m) => m.CommingsoonModule
      ),
  },
  {
    path: 'nofound',
    component: PublicComponent,
    data: { title: ' ALS - Nofound' },
    loadChildren: () =>
      import('./components/404/_module').then(
        (m) => m.NotFoundModule
      ),
  },
  {
    path: 'blog',
    component: PublicComponent,
    data: { title: ' ALS - Blog' },
    loadChildren: () =>
      import('./components/blog/_module').then(
        (m) => m.BlogModule
      ),
  },
  {
    path: 'blogdetail',
    component: PublicComponent,
    data: { title: ' ALS - Blogdetail' },
    loadChildren: () =>
      import('./components/blog-detail/_module').then(
        (m) => m.BlogdetailModule
      ),
  },
  {
    path: 'contact',
    component: PublicComponent,
    data: { title: ' ALS - Contact' },
    loadChildren: () =>
      import('./components/contact/_module').then(
        (m) => m.ContactModule
      ),
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: ' ALS - Contact' },
    
  },
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
