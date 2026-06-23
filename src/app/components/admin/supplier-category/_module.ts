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
import { AddSupplierCategoryComponent } from './add-supplier-category.component';
import { SupplierCategoryComponent } from './supplier-category.component';

@NgModule({
  declarations: [
    SupplierCategoryComponent,
    AddSupplierCategoryComponent
  ],
  imports: [
    MatIconModule,
    CommonModule,
    NgSelectModule,
    FormsModule,
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
      { path: '', component: SupplierCategoryComponent },
      { path: 'add', component: AddSupplierCategoryComponent }
    ])
  ],
  providers: [DatePipe],
})
export class SupplierCategoryModule { }
