import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgGridModule } from 'ag-grid-angular';
import { AddVoucherCategoryComponent } from './add-voucher-category.component';
import { VoucherCategoryComponent } from './voucher-category.component';

@NgModule({
  declarations: [
    VoucherCategoryComponent,
    AddVoucherCategoryComponent
  ],

  imports: [
    MatIconModule,
    CommonModule,
    NgSelectModule ,
    FormsModule ,
    ReactiveFormsModule,
    AgGridModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatRadioModule,
    MatTabsModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatSelectModule,
    RouterModule.forChild([
      { path: '', component: VoucherCategoryComponent },
      { path: 'add', component: AddVoucherCategoryComponent }
    ])
  ],
  providers: [DatePipe],

})
export class  VoucherCategoryModule {

}