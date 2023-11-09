import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CommingsoonComponent } from './commingsoon.component';
// import { CarouselModule } from '../../../../node_modules/';


@NgModule({
  declarations: [
    CommingsoonComponent,
  ],

  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: CommingsoonComponent }
    ])
  ],
  providers: []

})
export class CommingsoonModule {

}