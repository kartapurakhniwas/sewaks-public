import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DonationComponent } from './donation.component';
// import { CarouselModule } from '../../../../node_modules/';


@NgModule({
  declarations: [
    DonationComponent,
  ],

  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: DonationComponent }
    ])
  ],
  providers: []

})
export class DonationModule {

}