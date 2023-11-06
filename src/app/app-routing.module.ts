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
    path: 'login',
    component: LoginComponent,
    data: { title: ' ALS - Login' }
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
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
