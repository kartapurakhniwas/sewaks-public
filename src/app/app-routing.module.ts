import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicComponent } from './layout/public/public.component';

const routes: Routes = [
  {
    path: '',
    component: PublicComponent,
    data: { title: ' ALS - Home' },
    loadChildren: () =>
      import('./components/homepage/_module').then(
        (m) => m.HomepageModule
      ),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
