import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrivacyComponent } from './privacy.component';
// import { CarouselModule } from '../../../../node_modules/';


@NgModule({
  declarations: [
    PrivacyComponent,
  ],

  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: PrivacyComponent }
    ])
  ],
  providers: []

})
export class PrivacyModule {

}