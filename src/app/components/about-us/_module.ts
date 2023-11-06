import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AboutUsComponent } from './about-us.component';
// import { CarouselModule } from '../../../../node_modules/';


@NgModule({
  declarations: [
    AboutUsComponent,
  ],

  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: AboutUsComponent }
    ])
  ],
  providers: []

})
export class AboutUsModule {

}