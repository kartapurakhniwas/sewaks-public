import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VolunteersComponent } from './volunteers.component';
// import { CarouselModule } from '../../../../node_modules/';


@NgModule({
  declarations: [
    VolunteersComponent,
  ],

  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: VolunteersComponent }
    ])
  ],
  providers: []

})
export class VolunteersModule {

}