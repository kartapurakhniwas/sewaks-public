import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
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

  constructor(
    public gl: MasterService,
    private vol: Billservice,
    public datepipe: DatePipe,
    private nav: Router,
    private dialog: MatDialog
  ) {
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
            }
            case 2: {
              return 'Electricity';
            }
            case 3: {
              return 'Milk';
            }
            case 4: {
              return 'Grocery';
            }
            case 5: {
              return 'Miscellaneous';
            }
          
            default:
              return '---';
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
            }
            case 2: {
              return 'Cheque';
            }
            case 3: {
              return 'NEFT';
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
              return '---';
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
            }
            case 2: {
              return 'Pending';
            }
          
            default:
              return '---';
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
    this.rowSelection = "multiple";
    this.gl.setRowData = null;
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
    const selectedNodes = this.agGrid?.api.getSelectedNodes();
    const selectedData: any[] = selectedNodes?.map((node) => node.data) || [];
    this.gl.setRowDataArray = selectedData;
    this.gl.setRowData = selectedData[0] || null;
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

   editBill(){
      if(this.gl.setRowData){
        this.nav.navigateByUrl("admin/bills/edit/"+this.gl.setRowData.id)
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

  printVoucher(): void {
    if (!this.gl.setRowDataArray?.length) { return; }
    this.dialog.open(PrintVoucherPopup, { width: '1070px' });
  }

  deleteAll() {
    let self = this;
    self.vol.DeleteAll().subscribe({
      next: (response: any) => {
        if (response.respStatus) {
          this.refresh();
        } else {
          console.error('Request failed:', response.message);
        }
      },
      error: (error:any) => {
        console.error('Error occurred:', error);
      },
    });
  }

}

// ... existing imports ...

@Component({
  selector: 'print-voucher-dialog',
  templateUrl: './voucher.component.html',
})
export class PrintVoucherPopup implements OnInit {
  @ViewChild('voucherDiv') voucherDiv!: ElementRef;
  voucherList: any[] = [];

  private voucherStyles = `
      * { margin: 0; padding: 0; box-sizing: border-box; -webkit-print-color-adjust: exact; }
      body { font-family: 'Courier New', monospace; background: white; color: black; }
      
      .page-container {
        width: 210mm;
        height: 297mm;
        overflow: hidden;
        page-break-after: always;
        display: flex;
        flex-direction: column;
        padding: 5mm 0;
      }

      .voucher-container {
        width: 200mm;
        height: 138mm; 
        border: 2px solid black;
        margin: 0 auto;
        display: flex;
        overflow: hidden;
        background: white;
        margin-bottom: 2mm;
      }

      .sidebar {
        width: 65px;
        background: #eeeeee; 
        border-right: 2px solid black;
        display: flex;
        flex-direction: row-reverse;
        justify-content: center;
        align-items: start;
        padding: 10px;
        line-height: 1.2;
      }

      .vertical-text {
        writing-mode: vertical-rl;
        font-weight: bold;
        font-size: 11px;
        color: black;
        white-space: nowrap;
        margin-left: 5px;
        margin-top: 8px;
      }

      .content { flex: 1; padding: 6px 15px; display: flex; flex-direction: column; }

      .header h1 { 
        font-size: 20px; 
        color: black; 
        text-decoration: underline; 
        letter-spacing: 6px; 
        text-align: center; 
        margin-bottom: 5px; 
        font-weight: 900;
      }
      .firm-name { font-size: 22px; font-weight: bold; color: black; text-align: center; text-transform: uppercase; }
      .firm-details { font-size: 13px; text-align: center; color: black; line-height: 1; margin-bottom: 8px; border-bottom: 1px solid black; padding-bottom: 5px; font-weight: bold;}

      .info-row { display: flex; justify-content: space-between; margin-bottom: 4px;    font-size: 13px;
    color: black;
    font-weight: bold;}
      .info-line-short { border-bottom: 1.5px solid black; min-width: 100px; font-weight: bold; text-align: center; }

      .particulars-header { text-align: center; margin: 5px 0; border-top: 2px solid black; border-bottom: 2px solid black; background: #f2f2f2; }
      .particulars-header h2 { font-size: 13px; color: black; letter-spacing: 3px; margin: 4px 0; font-weight: bold; }

      .table-section { border: 2px solid black; flex: 1; display: flex; flex-direction: column; font-size: 12px; overflow: hidden; }
      .table-header { background: #e0e0e0; font-weight: bold; border-bottom: 2px solid black; display: flex; }
      .col-main {  font-weight:bold;   font-size: 13px;color:#000;flex: 1; padding: 6px 5px; border-right: 1.5px solid black; line-height: 1; }
      .col-rupee {  font-weight:bold;   font-size: 13px;color:#000;width: 90px; padding: 6px 5px; text-align: right; border-right: 1.5px solid black; line-height: 1; font-weight: bold;}
      .col-paise { font-weight:bold;    font-size: 13px;color:#000;width: 40px; padding: 6px 5px; text-align: center; line-height: 1; font-weight: bold;}
      
      .section-label { position: relative; background: #f2f2f2; font-weight: bold; font-size: 12px; border-bottom: 1px solid black; padding: 2px 5px; color: black; }
      .section-label .heading-content { 
        position: absolute;
        right: 0;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        font-weight: bold;
        text-align: center;
        width: 100%;
        font-size: 14px; 
      }
      
      .table-row { color:#000;display: flex; border-bottom: 1px solid #ccc; min-height: 25px; align-items: center; }
      .total-row { display: flex; border-top: 2px solid black; background: #e0e0e0; font-weight: bold; margin-top: auto; }

      .footer { display: flex; justify-content: space-between; margin-top: 20px; height: 70px; align-items: flex-end; }
      .footer-item { text-align: center; width: 30%; }
      .footer-label { font-size: 12px; color: black; margin-bottom: 40px; font-weight: bold; }
      .footer-line { border-bottom: 1.5px solid black; }

      .cut-line { width: 100%; border-top: 2px dashed #000; height: 2mm; margin: 4mm 0; position: relative; }
      .cut-line::after { content: '✂'; position: absolute; top: -12px; left: 50%; background: white; padding: 0 10px; color: black; font-size: 16px; }

      @media print {
        @page { size: A4 portrait; margin: 0; }
        .no-print { display: none; }
        * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
  `;

  // ... (keep rest of logic same as previous: getPreviousMonthName, numberWithCommas, numberToWords, chunkedVouchers with size 2) ...
  // ...
  
  constructor(public gl: MasterService, public datepipe: DatePipe, public dialogRef: MatDialogRef<PrintVoucherPopup>) {}
  ngOnInit(): void { this.buildVouchers(); }
  
  buildVouchers() {
    const rows = this.gl.setRowDataArray || [];
    this.voucherList = rows.map((bill: any) => ({
      voucherNo: bill?.billNo || '',
      date: this.datepipe.transform(bill?.billDate, 'dd/MM/yyyy') || '',
      debitEntries: [{ description: `Amount paid for the month of ${this.getPreviousMonthName(bill?.billDate)} to ${bill?.supplierName || ''}` , rupees: this.numberWithCommas(bill?.billAmount)+ '/-' }
        ,{description: '\n'}
        // ,{description: '\n'}
      ],
      debitTotal: { rupees: this.numberWithCommas(bill?.billAmount) + '/-' },
      debitTotalAmt: { rupees: this.numberWithCommas(bill?.billAmount) },
      creditEntries: [
        // { description: 'SBI AC 6287' },
        { description: `NEFT transfer to ${bill?.supplierName || ''} for the month of ${this.getPreviousMonthName(bill?.billDate)}`, rupees: this.numberWithCommas(bill?.billAmount) + '/-' }
        ,{description: '\n'}
        // ,{description: '\n'}
      ],
      creditTotal: { rupees: this.numberWithCommas(bill?.billAmount) + '/-' }
    }));
  }

  printPage() {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`<html><head><style>${this.voucherStyles}</style></head><body>${this.voucherDiv.nativeElement.innerHTML}</body></html>`);
    printWindow.document.close();
    setTimeout(() => { printWindow.focus(); printWindow.print();  }, 250);
  }

  // getPreviousMonthName(dateValue: any): string {
  //   if (!dateValue) return '';
  //   const date = new Date(dateValue);
  //   date.setMonth(date.getMonth() - 1);
  //   return date.toLocaleString('default', { month: 'long' });
  // }

getPreviousMonthName(dateValue: any): string {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  date.setMonth(date.getMonth() - 1);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

  numberWithCommas(x: any) { return (Number(x) || 0).toLocaleString('en-IN'); }

  numberToWords(num: any): string {
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const n = Number(String(num).replace(/,/g, ''));
    if (!n) return '';
    const makeWords = (v: number): string => {
      if (v < 20) return a[v];
      if (v < 100) return b[Math.floor(v / 10)] + ' ' + a[v % 10];
      if (v < 1000) return a[Math.floor(v / 100)] + ' Hundred ' + makeWords(v % 100);
      if (v < 100000) return makeWords(Math.floor(v / 1000)) + ' Thousand ' + makeWords(v % 1000);
      if (v < 10000000) return makeWords(Math.floor(v / 100000)) + ' Lakh ' + makeWords(v % 100000);
      return makeWords(Math.floor(v / 10000000)) + ' Crore ' + makeWords(v % 10000000);
    };
    return makeWords(n);
  }

  onNoClick(): void { this.dialogRef.close(''); }

  get chunkedVouchers() {
    const size = 2;
    const chunks = [];
    for (let i = 0; i < this.voucherList.length; i += size) { chunks.push(this.voucherList.slice(i, i + size)); }
    return chunks;
  }

}