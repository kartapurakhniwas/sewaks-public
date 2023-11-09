import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TermsComponent } from './terms.component';
// import { CarouselModule } from '../../../../node_modules/';


@NgModule({
  declarations: [
    TermsComponent,
  ],

  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: TermsComponent }
    ])
  ],
  providers: []

})
export class TermsModule {

}