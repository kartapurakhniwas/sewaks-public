import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomepageComponent } from './homepage.component';
// import { CarouselModule } from '../../../../node_modules/';


@NgModule({
  declarations: [
    HomepageComponent,
  ],

  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: HomepageComponent }
    ])
  ],
  providers: []

})
export class HomepageModule {

}