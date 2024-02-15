import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { DebitListComponent } from './debit-list-xlsx.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgGridModule } from 'ag-grid-angular';
import { MatIconModule } from '@angular/material/icon';
import { TableUtil } from 'src/shared/tableUtil';


@NgModule({
  declarations: [
    DebitListComponent,
  ],

  imports: [
    CommonModule,
    NgSelectModule ,
    FormsModule ,
    MatSnackBarModule,
    ReactiveFormsModule,
    AgGridModule,
    MatIconModule,
    RouterModule.forChild([
      { path: '', component: DebitListComponent }
    ])
  ],
  providers: [DatePipe, TableUtil]

})
export class DebitListModule {

}