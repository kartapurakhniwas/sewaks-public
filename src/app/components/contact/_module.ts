import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContactComponent } from './contact.component';
// import { CarouselModule } from '../../../../node_modules/';


@NgModule({
  declarations: [
    ContactComponent,
  ],

  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: ContactComponent }
    ])
  ],
  providers: []

})
export class ContactModule {

}