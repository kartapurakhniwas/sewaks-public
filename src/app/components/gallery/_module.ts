import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GalleryComponent } from './gallery.component';
// import { CarouselModule } from '../../../../node_modules/';


@NgModule({
  declarations: [
    GalleryComponent,
  ],

  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: GalleryComponent }
    ])
  ],
  providers: []

})
export class GalleryModule {

}