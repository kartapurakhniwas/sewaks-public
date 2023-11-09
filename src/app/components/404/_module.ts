import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NofoundComponent } from './nofound.component';
// import { CarouselModule } from '../../../../node_modules/';


@NgModule({
  declarations: [
    NofoundComponent,
  ],

  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: NofoundComponent }
    ])
  ],
  providers: []

})
export class NotFoundModule {

}