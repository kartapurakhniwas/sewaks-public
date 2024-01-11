import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContactComponent } from './contact.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { CarouselModule } from '../../../../node_modules/';


@NgModule({
  declarations: [
    ContactComponent,
  ],

  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: ContactComponent }
    ])
  ],
  providers: []

})
export class ContactModule {

}