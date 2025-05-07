import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgGridModule } from 'ag-grid-angular';
import { AddDonationsComponent } from './add-donations.component';
import { DonationsComponent, PrintReceiptPopup } from './donations.component';

@NgModule({
  declarations: [
    DonationsComponent,
    AddDonationsComponent,
    PrintReceiptPopup
  ],

  imports: [
    MatMenuModule,
    CommonModule,
    NgSelectModule ,
    FormsModule ,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatDialogModule,
    MatTabsModule,
    MatIconModule,
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