import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community';
import { MasterService } from 'src/app/services';
import { VolunteerService } from 'src/app/services/volunteer.service';
import { TableUtil } from 'src/shared/tableUtil';

@Component({
  selector: 'app-volunteers',
  templateUrl: './volunteers.component.html',
  styleUrls: ['../style.scss']
})
export class VolunteersComponent implements OnInit {
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

  constructor(public gl: MasterService, private vol: VolunteerService, public datepipe: DatePipe) {
    this.columnDefs = [
      {
        headerName: 'Name',
        field: 'firstName',
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        sortingOrder: ["asc", "desc"],
        width: 200,
        valueGetter: (data:any) => {
          if(data.data.nickName != null || '') {
            return data.data.firstName + ' ' + data.data.lastName + ' ('+ data.data.nickName + ')';
          } else {
            return data.data.firstName + ' ' + data.data.lastName;
          }
        },
      },
      {
        headerName: 'Address',
        field: 'address',
        width: 300,
      },
      {
        headerName: 'Phone Number',
        field: 'primaryContact',
        width: 140,
      },
      {
        headerName: 'Email',
        field: 'email',
        width: 170,
      },
      {
        headerName: 'Donation (INR)',
        field: 'donationMoney',
        width: 130,
      },
      {
        headerName: 'Donation Date',
        field: 'donationDate',
        width: 130,
        valueGetter: (data:any) => {
          return this.datepipe.transform(data.data.donationDate, 'dd-MM-yyyy');
        },
      },
      {
        headerName: 'Want Rebate?',
        field: 'wantRebate',
        width: 130,
        valueGetter: (data:any) => {
          if (data.data.wantRebate) {
            return 'Yes'
          } else {
            return 'No'
          }
        }
      },
      {
        headerName: 'Referred By',
        field: 'referedBy',
        width: 140,
      },
      {
        headerName: 'Schedule Type',
        field: 'scheduleTypeId',
        width: 130,
        valueGetter: (data:any) => {
          switch (data.data.scheduleTypeId) {
            case 1: {
              return 'Monthly';
              break;
            }
            case 2: {
              return 'Quaterly';
              break;
            }
            case 3: {
              return 'Yearly';
              break;
            }
          
            default:
              return 'No Data';
              break;
          }
        },
      },
      {
        headerName: 'Blood Group',
        field: 'bloodGroup',
        width: 120,
      },
      // {
      //   headerName: 'Total Pallet/Items',
      //   field: 'pallet',
      //   width: 100
      // },
      
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
    let data = {
      "firstName": "",
      "referedById": 0,
      "bloodGroupTypeId": 0,
      "pageNumber": 1,
      "pageSize": 100000,
      "monthlyDonation": 0
    }
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
      self.vol.Delete(this.gl.setRowData.volunteerID).subscribe((m:any) => {
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
