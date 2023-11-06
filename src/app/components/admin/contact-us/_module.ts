import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { JoinUsFormComponent } from './join-us-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgGridModule } from 'ag-grid-angular';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    JoinUsFormComponent
  ],

  imports: [
    CommonModule,
    NgSelectModule ,
    FormsModule ,
    MatSnackBarModule,
    ReactiveFormsModule,
    AgGridModule,
    RouterModule.forChild([
      { path: '', component: JoinUsFormComponent }
    ])
  ],
  providers: [DatePipe,MatSnackBar],

})
export class  JoinUsFormModule {

}