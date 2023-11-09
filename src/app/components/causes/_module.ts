import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CausesComponent } from './causes.component';
import { CausesDetailComponent } from './causes-detail.component';
// import { CarouselModule } from '../../../../node_modules/';


@NgModule({
  declarations: [
    CausesComponent,
    CausesDetailComponent,
  ],

  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: CausesComponent },
      { path: 'details', component: CausesDetailComponent }
    ])
  ],
  providers: []

})
export class CausesModule {

}