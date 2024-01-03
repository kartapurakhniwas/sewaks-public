import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community';
import { MasterService } from 'src/app/services';
import { Billservice } from 'src/app/services/bills.service';
import { TableUtil } from 'src/shared/tableUtil';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['../style.scss']
})
export class BillsComponent implements OnInit {
  @ViewChild("agGrid") agGrid: AgGridAngular | undefined;
  selectedCar:any;
  cars = [
    { id: 1, name: 'Volvo' },
    { id: 2, name: 'Saab' },
    { id: 3, name: 'Opel' },
    { id: 4, name: 'Audi' },
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

  constructor(public gl: MasterService, private vol: Billservice, public datepipe: DatePipe) {
    this.columnDefs = [
      {
        headerName: 'Supplier Name',
        field: 'supplierName',
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        sortingOrder: ["asc", "desc"],
        width: 180
      },
      {
        headerName: 'bill No',
        field: 'billNo',
        width: 140,
        
      },
      {
        headerName: 'bill Date',
        field: 'billDate',
        width: 140,
        valueGetter: (data:any) => {
          return this.datepipe.transform(data.data.billDate, 'dd-MM-yyyy');
        },
      },
      {
        headerName: 'bill Amount',
        field: 'billAmount',
        width: 170,
      },
      {
        headerName: 'bill Type',
        field: 'billType',
        width: 180,
        valueGetter: (data:any) => {
          switch (data.data.billType) {
            case 1: {
              return 'Water';
              break;
            }
            case 2: {
              return 'Electricity';
              break;
            }
            case 3: {
              return 'Milk';
              break;
            }
            case 4: {
              return 'Grocery';
              break;
            }
            case 5: {
              return 'Miscellaneous';
              break;
            }
          
            default:
              return '---';
              break;
          }
        },
      },
      {
        headerName: 'due Date',
        field: 'dueDate',
        width: 130,
        valueGetter: (data:any) => {
          return this.datepipe.transform(data.data.dueDate, 'dd-MM-yyyy');
        },
      },
      {
        headerName: 'payment mode',
        field: 'mode',
        width: 180,
        valueGetter: (data:any) => {
          switch (data.data.mode) {
            case 1: {
              return 'Cash';
              break;
            }
            case 2: {
              return 'Cheque';
              break;
            }
            case 3: {
              return 'NEFT';
              break;
            }
            case 4: {
              return 'UPI';
              break;
            }
            case 5: {
              return 'IMPS';
              break;
            }
            case 6: {
              return 'RTGS';
              break;
            }
          
            default:
              return '---';
              break;
          }
        },
      },
      {
        headerName: 'neft Date',
        field: 'neftDate',
        width: 130,
        valueGetter: (data:any) => {
          return this.datepipe.transform(data.data.neftDate, 'dd-MM-yyyy');
        },
      },
      {
        headerName: 'neft Amount',
        field: 'neftAmount',
        width: 180,
      },
      {
        headerName: 'status',
        field: 'status',
        width: 180,
        valueGetter: (data:any) => {
          switch (data.data.status) {
            case 1: {
              return 'Paid';
              break;
            }
            case 2: {
              return 'Pending';
              break;
            }
          
            default:
              return '---';
              break;
          }
        },
      },
      {
        headerName: 'comments',
        field: 'comments',
        width: 180,
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
    this.gl.setRowData = null;
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
    const selectedData: any = selectedNodes?.map((node) => node.data);
    this.gl.setRowData = JSON.stringify(selectedData[0])
      ? selectedData[0]
      : null;
  }

  delete() {
    let self = this;
    if (confirm("Are you sure you want to Delete?")) {
      self.vol.Delete(this.gl.setRowData.id).subscribe((m:any) => {
        if (m.respStatus) {
            this.refresh();
            this.gl.setRowData = null;
        }
      }
    );
    }
    
  }

  exportAsExcel() {
    let data = this.getpaged;
    console.log(data, "Data");
    let d = [];
    let data1 = {};

    for (var i = 0; i < data.length; i++) {
      data1 = {
        Name: data[i].firstName + ' ' + data[i].lastName,
        "Refered By": data[i].referedBy,
        "Primary Contact": data[i].primaryContact,
        "Email": data[i].email,
        "Address": data[i].address,
        "Donation (INR)": data[i].donationMoney,
        "Donation Date": data[i].donationDate,
        "Want Rebate": data[i].wantRebate,
        "Schedule Type": data[i].scheduleType,
        "Blood Group": data[i].bloodGroupName
      };
      d.push(data1);
    }
    console.log(d, "D");

    TableUtil.exportAgGridToExcel(d, "KPN Volunteer");
  }


}
