import { VolunteerService } from './../../../services/volunteer.service';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community';
import { MasterService } from 'src/app/services';
import { DonationService } from 'src/app/services/donations.service';
import { TableUtil } from 'src/shared/tableUtil';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['../style.scss']
})
export class DonationsComponent implements OnInit {
  @ViewChild("agGrid") agGrid: AgGridAngular | undefined;
  selectedCar:any;

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

  constructor(public gl: MasterService, private vol: DonationService, public datepipe: DatePipe, public dialog: MatDialog,
    private nav: Router) {
    this.columnDefs = [
      {
        headerName: 'Donnor Name',
        field: 'donorName',
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        sortingOrder: ["asc", "desc"],
        width: 180
      },
      {
        headerName: 'receipt No',
        field: 'receiptNo',
        width: 140,
      },
      {
        headerName: 'receipt Date',
        field: 'receiptDate',
        width: 130,
        valueGetter: (data:any) => {
          return this.datepipe.transform(data.data.receiptDate, 'dd-MM-yyyy');
        },
      },
      {
        headerName: 'receipt Amount',
        field: 'receiptAmount',
        width: 170,
      },
      {
        headerName: 'razor pay ID',
        field: 'bankAmount',
        width: 180,
      },
      {
        headerName: 'mode',
        field: 'mode',
        width: 180,
        valueGetter: (data:any) => {
          switch (data.data.mode) {
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
              return 'No Data';
              break;
          }
        },
      },
      {
        headerName: 'Cheque No',
        field: 'chequeNo',
        width: 180,
      },
      {
        headerName: 'Cheque Date',
        field: 'chequeDate',
        width: 180,
        valueGetter: (data:any) => {
          return this.datepipe.transform(data.data.chequeDate, 'dd-MM-yyyy');
        },
      },
      
      
      // {
      //   headerName: 'date of Bank Credit',
      //   field: 'dateofBankCredit',
      //   width: 130,
      //   valueGetter: (data:any) => {
      //     return this.datepipe.transform(data.data.dateofBankCredit, 'dd-MM-yyyy');
      //   },
      // },
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
    this.rowSelection = "multiple";
    this.gl.setRowDataArray = [];
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
    this.gl.setRowDataArray = null;
    const selectedNodes = this.agGrid?.api.getSelectedNodes();
    const selectedData: any = selectedNodes?.map((node) => node.data);
    this.gl.setRowDataArray = JSON.stringify(selectedData)
      ? selectedData
      : null;
  }

  delete() {
    let self = this;
    if (confirm("Are you sure you want to Delete?")) {
      self.vol.Delete(this.gl.setRowDataArray[0].id).subscribe((m:any) => {
        if (m.respStatus) {
            this.refresh();
            this.gl.setRowDataArray = [];
        }
      }
    );
    }
    
  }

  importExcel(event:any) {
    console.log(TableUtil.importExcel(event));
     
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

  printReciept(): void {
    console.log(this.gl.setRowDataArray, "this.gl.setRowData");
    
    const dialogRef = this.dialog.open(PrintReceiptPopup, {
      width: '1070px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closedddd');
      
    });
  }
  
  addNew() {
    this.gl.setRowDataArray = [];
    this.nav.navigateByUrl('/admin/donations/add')
  }


}




import * as converter from "number-to-words";

@Component({
  selector: 'print-receipt-dialog',
  templateUrl: './receipt.component.html',
  styleUrls: ['./donations.component.scss']
})

export class PrintReceiptPopup {
  @ViewChild('myDiv') myDiv: ElementRef = null as any;
  htmlContent: any = '';

  constructor(public gl: MasterService, private srv: DonationService, private vol: VolunteerService, public datepipe: DatePipe, public dialogRef: MatDialogRef<PrintReceiptPopup>) {
   
  }

  ngOnInit(): void {
    this.GetByID();
  }

  GetByID() {
    console.log(this.gl.setRowDataArray, "this.gl.setRowDataArray");
    
    let self = this;
    if (this.gl.setRowDataArray.length > 1) {
      // this.gl.setRowDataArray.forEach((element:any) => {
      //   self.vol.GetById(element.donorId).subscribe((m: any) => {
      //     if (m.respStatus) {
      //       console.log(m, "dataatatat");
      //       element.address = m.lstModel[0].address;
      //     }
      //   });
      // });
      
    }
  }

  printPage() {
    console.log(this.gl.setRowDataArray, "this.gl.setRowDataArray");
    
    console.log(this.myDiv.nativeElement.innerHTML, "this.myDiv");
  
    let popupWin:any;
    // printContents = doc.getElementById('print-section').innerHTML;

    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(
      this.gl.printReceipt(this.myDiv.nativeElement.innerHTML)
      );
      // window.print();
      popupWin.print();
    popupWin.close();
  }

  onNoClick(): void {
    this.dialogRef.close('');
  }

  isOdd(n:any) {
    return n % 3 == 0;
 }

 isEven(n:any) {
  return n % 2 == 0
 }

 inWords(item:any) {
  return converter.toWords(item)
 }

 numberWithCommas(x:any) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

}