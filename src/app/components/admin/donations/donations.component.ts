import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community';
import { MasterService } from 'src/app/services';
import { DonationService } from 'src/app/services/donations.service';
import { TableUtil } from 'src/shared/tableUtil';
import { VolunteerService } from './../../../services/volunteer.service';

@Component({
  selector: 'app-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['../style.scss']
})
export class DonationsComponent implements OnInit {
  @ViewChild("agGrid") agGrid: AgGridAngular | undefined;

  fromDate:any = new Date();
  toDate:any = new Date();

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
  getpaged: any;
  filteredDonations: any[] = [];
  donorNameFilter: string = '';

  constructor(public gl: MasterService, private vol: DonationService, public datepipe: DatePipe, public dialog: MatDialog,
    private nav: Router) {
      const currentYear = new Date().getFullYear();
    
    // Set fromDate to Jan 1 of current year
    this.fromDate = new Date(currentYear, 0, 1); // Month is 0-indexed (0 = January)
    
    // Set toDate to Dec 31 of current year
    this.toDate = new Date(currentYear, 11, 31); // 11 = December

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
        headerName: 'receipt date',
        field: 'receiptDate',
        width: 140,
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
        headerName: 'Created Date',
        field: 'dateofBankCredit',
        width: 130,
        valueGetter: (data:any) => {
          return this.datepipe.transform(data.data.dateofBankCredit, 'dd-MM-yyyy');
        },
      },
      // {
      //   headerName: 'razor pay ID',
      //   field: 'bankAmount',
      //   width: 180,
      // },
      {
        headerName: 'mode',
        field: 'mode',
        width: 180,
        valueGetter: (data:any) => {
          switch (data.data.mode) {
            case 2: {
              return 'Cheque';
            }
            case 3: {
              return 'Online';
            }
            case 4: {
              return 'UPI';
            }
            case 5: {
              return 'IMPS';
            }
            case 6: {
              return 'RTGS';
            }
          
            default:
              return 'No Data';
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

  searchDonations() {
    this.filteredDonations = this.filterDonations(
      this.getpaged,
      this.fromDate,
      this.toDate,
      this.donorNameFilter
    );
  }

  private filterDonations(
    items: any,
    fromDate: Date,
    toDate: Date,
    nameFilter: string
  ): any {
    return items
      .filter((item:any) => {
        // Date filter
        if (!item.receiptDate) return false;
        const receiptDate = new Date(item.receiptDate);
        const dateMatch = receiptDate >= fromDate && receiptDate <= toDate;
        
        // Name filter (case insensitive partial match)
        const nameMatch = item.donorName.toLowerCase().includes(nameFilter.toLowerCase());
        
        return dateMatch && (nameFilter === '' || nameMatch);
      })
      .sort((a:any, b:any) => +a.receiptNo - +b.receiptNo); // Numerical sort
  }

  clearSearchFilter() {
    this.donorNameFilter = '';
    this.filteredDonations = this.getpaged;
    this.gridApi?.setRowData(this.getpaged);
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    let self = this;
    self.vol.GetAllByPagination().subscribe((m:any) => {
        if (m.respStatus) {
          this.getpaged = m.lstModel;
          this.filteredDonations = m.lstModel;
        }
      }
    );
  }

  onGridReady(params:any) {
    this.gridApi = params.api;
    this.gidColumnApi = params.columnApi;
    params.api.setRowData(this.filteredDonations);
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
      for (let index = 0; index < this.gl.setRowDataArray?.length; index++) {
        setTimeout(() => {
          self.vol.Delete(this.gl.setRowDataArray[index].id).subscribe((m:any) => {
            if (m.respStatus) {
                this.refresh();
                this.gl.setRowDataArray = [];
            }
          });
        }, 100);
      }
    }
    
  }

  importExcel(event:any) {
    // console.log(TableUtil.importExcel(event));
     
  }

  exportAsExcel() {
    let data = this.filteredDonations;
    console.log(data, "Data");
    let d = [];
    let data1 = {};

    for (var i = 0; i < data.length; i++) {
      data1 = {
        "Name": data[i].donorName,
        "Reciept No": data[i].receiptNo,
        "Receipt Date": data[i].receiptDate,
        "Receipt Amount": data[i].receiptAmount,
        "Created Date": data[i].dateofBankCredit,
        "Mode": (() => {
          switch (data[i].mode) {
            case 2:
              return 'Cheque';
            case 3:
              return 'Online';
            case 4:
              return 'UPI';
            case 5:
              return 'IMPS';
            case 6:
              return 'RTGS';
            default:
              return 'No Data';
          }
        })(),
        "PAN No": data[i].panNo,
        "Donor Address": data[i].donorAddress
      };
      d.push(data1);
    }
    console.log(d, "D");

    TableUtil.exportAgGridToExcel(d, "KPN Donations");
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




// import * as converter from "number-to-words";

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
      popupWin.print();
      // popupWin.close();
      // window.print();
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

 isFourth(n: any) {
  return n % 4 == 0;
}

 inWords(item:any) {
  return this.numberToWords(item)
 }

 numberWithCommas(x:any) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// converting from numbers to words

 numberToWords(num: number): string {
  const belowTwenty = [
      '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
      'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];

  const tens = [
      '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
  ];

  const scales = ['', 'Thousand', 'Lakh', 'Crore'];

  if (num === 0) return 'Zero';

  function convertBelowThousand(n: number): string {
      let result = '';

      if (n >= 100) {
          result += belowTwenty[Math.floor(n / 100)] + ' Hundred ';
          n %= 100;
      }

      if (n >= 20) {
          result += tens[Math.floor(n / 10)] + ' ' + belowTwenty[n % 10] + ' ';
      } else if (n > 0) {
          result += belowTwenty[n] + ' ';
      }

      return result.trim();
  }

  let result = '';
  let scaleIndex = 0;

  while (num > 0) {
      let part = 0;

      // For the first iteration (thousands), we take the last three digits,
      // and for further iterations, we take the next two digits at a time.
      if (scaleIndex === 0) {
          part = num % 1000;
          num = Math.floor(num / 1000);
      } else {
          part = num % 100;
          num = Math.floor(num / 100);
      }

      if (part > 0) {
          let partInWords = convertBelowThousand(part);
          if (scaleIndex > 0) {
              partInWords += ' ' + scales[scaleIndex];
          }
          result = partInWords + ' ' + result; 
      }

      scaleIndex++;
  }

  return result.trim();
}

}