import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FaqComponent } from './faq.component';
// import { CarouselModule } from '../../../../node_modules/';


@NgModule({
  declarations: [
    FaqComponent,
  ],

  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: FaqComponent }
    ])
  ],
  providers: []

})
export class FaqModule {

}