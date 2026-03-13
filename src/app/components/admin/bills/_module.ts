import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgGridModule } from 'ag-grid-angular';
import { AddBillsComponent } from './add-bills.component';
import { BillsComponent, PrintVoucherPopup } from './bills.component';
import { ManualVoucherComponent } from './manual-voucher.component';


@NgModule({
  declarations: [
 BillsComponent,
   AddBillsComponent,
   PrintVoucherPopup,
    ManualVoucherComponent,
  ],

  imports: [
    MatIconModule,
    CommonModule,
    NgSelectModule ,
    FormsModule ,
    ReactiveFormsModule,
    AgGridModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatTabsModule,
    MatDialogModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatSelectModule,
    RouterModule.forChild([
      { path: '', component: BillsComponent },
      { path: 'add', component: AddBillsComponent },
      { path: 'manual', component: ManualVoucherComponent },
       { path: 'edit/:billId', component: AddBillsComponent }
    ])
  ],
  providers: [DatePipe,MatSnackBarModule],

})
export class  BillsModule {

}