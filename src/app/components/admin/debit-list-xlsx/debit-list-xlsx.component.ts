import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community';
import { MasterService } from 'src/app/services';
import { JoinService } from 'src/app/services/joinus.service';
import { TableUtil } from 'src/shared/tableUtil';


@Component({
  selector: 'app-debit-list-xlsx',
  templateUrl: './debit-list-xlsx.component.html'
})
export class DebitListComponent implements OnInit {

  @ViewChild("agGrid") agGrid: AgGridAngular | undefined;
  selectedCar:any;
  status:any = [
    {id:1, view: 'Decline'},
    {id:2, view: 'New Submission'},
    {id:3, view: 'Called'},
    {id:4, view: 'Confirmed'},
  ];

public gridApi: any;
public gidColumnApi: any;
public columnDefs: any;
public sortingOrder: any;
defaultColDef:any;
gridOptions: GridOptions;
  rowSelection: string;
  statusValue: any;
  isfilter: any;
  getPaged: any;
  getpaged: any;

  constructor(public gl: MasterService, private vol: JoinService, public datepipe: DatePipe,
    private _snackBar: MatSnackBar) {
    this.columnDefs = [
      {
        headerName: 'Name',
        field: 'name',
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        sortingOrder: ["asc", "desc"]
      },
      {
        headerName: 'Email',
        field: 'email',
      },
      {
        headerName: 'Phone Number',
        field: 'mobileNo',
      },
      {
        headerName: 'Date',
        field: 'joindate',
        // valueGetter: this.datepipe.transform(data, 'dd-MM-yyyy');
        valueGetter: (data:any) => {
          return this.datepipe.transform(data.data.joindate, 'dd-MM-yyyy');
        },
      },
      {
        headerName: 'Notes',
        field: 'notes',
      },
      {
        headerName: 'Referral Source',
        field: 'referralSource',
      },
      {
        headerName: 'Status',
        field: 'status',
        valueGetter: (data:any) => {
          switch (data.data.status) {
            case 1: {
              return 'Decline';
              break;
            }
            case 2: {
              return 'New Submission';
              break;
            }
            case 3: {
              return 'Called';
              break;
            }
            case 4: {
              return 'Verified As Volunteer';
              break;
            }
          
            default:
              return 'No Data';
              break;
          }
        },
      },
    ];
    this.defaultColDef = {
      editable: false,
      resizable: true,
      sortable: true,
        filter: true
    };
    this.gridOptions = {
      defaultColDef: {
        sortable: true,
        // filter: true
      }
    }
    this.rowSelection = "single";

  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    let self = this;
    self.vol.GetAllByPagination().subscribe((m:any) => {
        if (m.respStatus) {
          this.getpaged = m.lstModel;
        }
        console.log(m);

      }
    );
  }

  onGridReady(params:any) {
    this.gridApi = params.api;
    this.gidColumnApi = params.columnApi;
    params.api.setRowData(this.getPaged);
  }

  clearFilter() {
    this.gridApi.setFilterModel(null);
  }

  onSelectionChanged() {
    this.gl.setRowData = null;
    const selectedNodes = this.agGrid?.api.getSelectedNodes();
    const selectedData: any = selectedNodes?.map((node:any) => node.data);
    this.gl.setRowData = JSON.stringify(selectedData[0])
      ? selectedData[0]
      : null;
  }

  statusChange(id:any) {
    let self = this;
    if (this.gl.setRowData) {
      this.gl.setRowData.status = id;
      self.vol.update(this.gl.setRowData).subscribe((m:any) => {
        if (m.respStatus) {
          // window.alert('Update Successfully');
          this._snackBar.open("Update Successfully", "Okay", { 'duration': 3000 });
          this.refresh();
        }
      });
    } else {
      // window.alert('Something went wrong!');
      this._snackBar.open("Please fill required fields", "Okay", { 'duration': 3000 });
    }
  }

  importExcel(event:any) {
    console.log(TableUtil.importExcel(event));
     
  }

}
