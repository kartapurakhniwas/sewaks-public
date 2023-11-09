import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BlogdetailComponent } from './blogdetail.component';
// import { CarouselModule } from '../../../../node_modules/';


@NgModule({
  declarations: [
    BlogdetailComponent,
  ],

  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: BlogdetailComponent }
    ])
  ],
  providers: []

})
export class BlogdetailModule {

}