import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BlogComponent } from './blog.component';
// import { CarouselModule } from '../../../../node_modules/';


@NgModule({
  declarations: [
    BlogComponent,
  ],

  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: BlogComponent }
    ])
  ],
  providers: []

})
export class BlogModule {

}