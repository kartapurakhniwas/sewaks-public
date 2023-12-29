import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgGridModule } from 'ag-grid-angular';
import { AddDonationsComponent } from './add-donations.component';
import { DonationsComponent, PrintReceiptPopup } from './donations.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    DonationsComponent,
    AddDonationsComponent,
    PrintReceiptPopup
  ],

  imports: [
    CommonModule,
    NgSelectModule ,
    FormsModule ,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatDialogModule,
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