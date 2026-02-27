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
    body { font-family: 'Courier New', monospace; background: white; margin: 0; padding: 0; }
    
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
      height: 138mm; /* Fixed height for 2 per page */
      border: 2px solid #8B4513;
      margin: 0 auto;
      display: flex;
      overflow: hidden;
      background: white;
      margin-bottom: 2mm;
    }

    /* REVERTED SIDEBAR TO ORIGINAL ALIGNMENT */
    .sidebar {
      width: 60px;
      background: #f9f9f9;
      border-right: 2px solid #8B4513;
      display: flex;
      flex-direction: row-reverse;
      justify-content: center;
      align-items: start;
      padding: 10px;
      line-height: 1.2;
      margin-right: 3px;
    }

    .vertical-text {
      writing-mode: vertical-rl;
      font-weight: bold;
      font-size: 11px; /* Slightly larger for the new 2-per-page layout */
      color: #8B4513;
      white-space: nowrap;
      margin-left: 5px;
      margin-top: 8px;
    }

    .content { flex: 1; padding: 6px 15px; display: flex; flex-direction: column; }

    /* Firm Header Styles */
    .header h1 { font-size: 18px; color: #8B4513; text-decoration: underline; letter-spacing: 4px; text-align: center; margin-bottom: 3px; }
    .firm-name { font-size: 22px; font-weight: bold; color: #8B4513; text-align: center; text-transform: uppercase; }
    .firm-details { font-size: 10px; text-align: center; color: #333; line-height: 1.3; margin-bottom: 8px; border-bottom: 1px dotted #8B4513; padding-bottom: 5px; }

    .info-row { display: flex; justify-content: space-between; margin-bottom: 2px; font-size: 12px; }
    .info-line-short { border-bottom: 1px dotted #333; min-width: 80px; font-weight: bold; text-align: center; }

    .particulars-header { text-align: center; margin: 5px 0; border-top: 1.5px solid #8B4513; border-bottom: 1.5px solid #8B4513; background: #f0e6dc; }
    .particulars-header h2 { font-size: 12px; color: #8B4513; letter-spacing: 2px; margin: 4px 0; }

    .table-section { border: 1.5px solid #8B4513; flex: 1; display: flex; flex-direction: column; font-size: 12px; overflow: hidden; }
    .table-header { background: #f0e6dc; font-weight: bold; border-bottom: 1px solid #8B4513; display: flex; }
    .col-main { flex: 1; padding: 4px 5px; border-right: 1px solid #8B4513; line-height: 1; }
    .col-rupee { width: 80px; padding: 4px 5px; text-align: right; border-right: 1px solid #8B4513; line-height: 1;}
    .col-paise { width: 35px; padding: 4px 5px; text-align: center; line-height: 1;}
    
    .section-label { position: relative; background: #f9f9f9; font-weight: bold; font-size: 12px; border-bottom: 1px solid #8B4513; padding-left: 5px; color: #8B4513; }
    .section-label .heading-content {     position: absolute;
    right: 0;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    font-weight: normal;
    text-align: center;
    width: 100%;
    font-size: 15px; }
    .table-row { display: flex; border-bottom: 1px solid #eee; min-height: 20px; }
    .total-row { display: flex; border-top: 1.5px solid #8B4513; background: #f0e6dc; font-weight: bold; margin-top: auto; }

    .footer { display: flex; justify-content: space-between; margin-top: 15px; height: 80px; align-items: flex-end; }
    .footer-item { text-align: center; width: 30%; }
    .footer-label { font-size: 11px; color: #8B4513; margin-bottom: 45px; font-weight: bold; }
    .footer-line { border-bottom: 1px solid #333; }

    .cut-line { width: 100%; border-top: 2px dashed #bbb; height: 2mm; margin: 4mm 0; position: relative; }
    .cut-line::after { content: '✂'; position: absolute; top: -12px; left: 50%; background: white; padding: 0 5px; color: #bbb; }

    @media print {
      @page { size: A4 portrait; margin: 0; }
      .no-print { display: none; }
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
        ,{description: '\n'}
      ],
      debitTotal: { rupees: this.numberWithCommas(bill?.billAmount) + '/-' },
      debitTotalAmt: { rupees: this.numberWithCommas(bill?.billAmount) },
      creditEntries: [
        // { description: 'SBI AC 6287' },
        { description: `NEFT transfer to ${bill?.supplierName || ''} for the month of ${this.getPreviousMonthName(bill?.billDate)}`, rupees: this.numberWithCommas(bill?.billAmount) + '/-' }
        ,{description: '\n'}
        ,{description: '\n'}
      ],
      creditTotal: { rupees: this.numberWithCommas(bill?.billAmount) + '/-' }
    }));
  }

  printPage() {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`<html><head><style>${this.voucherStyles}</style></head><body>${this.voucherDiv.nativeElement.innerHTML}</body></html>`);
    printWindow.document.close();
    setTimeout(() => { printWindow.focus(); printWindow.print(); printWindow.close(); }, 250);
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