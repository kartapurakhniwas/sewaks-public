import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events.component';
import { EventsDetailComponent } from './events-detail.component';



@NgModule({
  declarations: [
    EventsComponent,
    EventsDetailComponent,
  ],

  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: EventsComponent },
      { path: 'events-detail', component: EventsDetailComponent }
    ])
  ],
  providers: []

})
export class EventsModule {

}