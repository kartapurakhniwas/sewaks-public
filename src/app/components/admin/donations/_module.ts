import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgGridModule } from 'ag-grid-angular';
import { AddDonationsComponent } from './add-donations.component';
import { DonationsComponent } from './donations.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [
    DonationsComponent,
    AddDonationsComponent
  ],

  imports: [
    CommonModule,
    NgSelectModule ,
    FormsModule ,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatTabsModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatSelectModule,
    AgGridModule,
    RouterModule.forChild([
      { path: '', component: DonationsComponent },
      { path: 'add', component: AddDonationsComponent }
    ])
  ],
  providers: [DatePipe],

})
export class  DonationsModule {

}