import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TestimonialsComponent } from './testimonials.component';
// import { CarouselModule } from '../../../../node_modules/';


@NgModule({
  declarations: [
    TestimonialsComponent,
  ],

  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: TestimonialsComponent }
    ])
  ],
  providers: []

})
export class TestimonialsModule {

}