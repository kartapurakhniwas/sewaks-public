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





@Component({
  selector: 'print-voucher-dialog',
  templateUrl: './voucher.component.html',
  styleUrls: ['../style.scss']
})
export class PrintVoucherPopup implements OnInit {
@ViewChild('voucherDiv') voucherDiv!: ElementRef;
  voucherList: any[] = [];


private voucherStyles = `
    * { margin: 0; padding: 0; box-sizing: border-box; -webkit-print-color-adjust: exact; }
    body { font-family: 'Courier New', monospace; background: white; margin: 0; padding: 0; }
    
    /* Forces the browser to treat every 3 vouchers as one rigid block */
    .page-container {
      width: 210mm;
      height: 297mm; /* Exact A4 Height */
      overflow: hidden;
      page-break-after: always;
      display: flex;
      flex-direction: column;
      padding: 5mm 0; /* Safety margin at top/bottom of page */
    }

    .voucher-container {
      width: 200mm;
      height: 90mm; /* Strict height to ensure 3 fit (3 x 90 = 270mm) */
      border: 2px solid #8B4513;
      margin: 0 auto;
      display: flex;
      overflow: hidden;
      background: white;
    }

      .sidebar {    width: 60px;
    background: #f9f9f9;
    border-right: 2px solid #8B4513;
    display: flex;
    flex-direction: row-reverse;
    justify-content: center;
    align-items: start;     padding: 10px;
    line-height: 1.2;
margin-right: 3px;
}
      .vertical-text { writing-mode: vertical-rl; font-weight: bold; font-size: 9px; color: #8B4513; white-space: nowrap;     margin-left: 5px;}


    .content {
      flex: 1;
      padding: 6px 12px;
      display: flex;
      flex-direction: column;
    }

    .header h1 {
      font-size: 16px;
      color: #8B4513;
      text-decoration: underline;
      letter-spacing: 4px;
      text-align: center;
      margin-bottom: 3px;
    }

    .info-row { display: flex; justify-content: space-between; margin-bottom: 2px; font-size: 10px; }
    .info-line { border-bottom: 1px dotted #333; flex: 1; font-weight: bold; padding-left: 5px; }
    .info-line-short { border-bottom: 1px dotted #333; min-width: 65px; font-weight: bold; text-align: center;}

    .particulars-header {
      text-align: center;
      margin: 3px 0;
      border-top: 1px solid #8B4513;
      border-bottom: 1px solid #8B4513;
      line-height: 1.2;
    }
  .particulars-header h2 { font-size: 10px; color: #8B4513; letter-spacing: 2px; margin-bottom: 4px;
    margin-top: 3px;}

    .table-section { border: 1.5px solid #8B4513; flex: 1; display: flex; flex-direction: column; font-size: 10px; overflow: hidden; }
    .table-header { background: #f0e6dc; font-weight: bold; border-bottom: 1px solid #8B4513; display: flex; }
    .table-row { display: flex; border-bottom: 1px solid #eee; min-height: 16px; }
    .col-main { flex: 1; padding: 2px 5px; border-right: 1px solid #8B4513; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .col-rupee { width: 60px; padding: 2px 5px; text-align: right; border-right: 1px solid #8B4513; }
    .col-paise { width: 30px; padding: 2px 5px; text-align: center; }
    
    .section-label { background: #f9f9f9; font-weight: bold; font-size: 8px; border-bottom: 1px solid #8B4513; padding-left: 5px; }
    .total-row { display: flex; border-top: 1.5px solid #8B4513; background: #f0e6dc; font-weight: bold; margin-top: auto; }

    .footer { display: flex; justify-content: space-between; margin-top: 6px; }
    .footer-item { text-align: center; width: 30%; }
    .footer-label { font-size: 8px; color: #8B4513; margin-bottom: 8px; }
    .footer-line { border-bottom: 1px solid #333; }

    .cut-line { 
      width: 100%; 
      border-top: 1px dashed #bbb; 
      height: 2mm; 
      margin: 1.5mm 0; 
    }

    @media print {
      @page { size: A4 portrait; margin: 0; }
      .no-print { display: none; }
      body { margin: 0; }
    }
  `;


  constructor(public gl: MasterService, public datepipe: DatePipe, public dialogRef: MatDialogRef<PrintVoucherPopup>) {}

  ngOnInit(): void { this.buildVouchers(); }

  buildVouchers() {
    const rows = this.gl.setRowDataArray || [];
    this.voucherList = rows.map((bill: any) => ({
      firmName: "SEWAKS' CHARITABLE TRUST",
      voucherNo: bill?.billNo || '',
      date: this.datepipe.transform(bill?.billDate, 'dd/MM/yyyy') || '',
      debitEntries: [
        { description: `Salary AC to ${bill?.supplierName || ''} as salary of ${this.getPreviousMonthName(bill?.billDate)}` , rupees: this.numberWithCommas(bill?.billAmount)+ '/-' },
        // { description: bill?.comments || '' }
      ],
      debitTotal: { rupees: this.numberWithCommas(bill?.billAmount) + '/-' },
      debitTotalAmt: { rupees: this.numberWithCommas(bill?.billAmount) },
      creditEntries: [
        { description: 'SBI AC 6287' },
        { description: `To ${bill?.supplierName || ''} (${this.getPreviousMonthName(bill?.billDate)} Salary)`, rupees: this.numberWithCommas(bill?.billAmount) + '/-' },
        // { description: this.modeLabel(bill?.mode), rupees: this.numberWithCommas(bill?.billAmount), paisa: '/-' },
        // { description: `Bill No: ${bill?.billNo || ''}` }
      ],
      creditTotal: { rupees: this.numberWithCommas(bill?.billAmount) + '/-' }
    }));
  }

  // printPage() {
  //   const printWindow = window.open('', '_blank', 'width=1000,height=800');
  //   printWindow?.document.write(`
  //     <html>
  //       <head>
  //         <title>Voucher Print</title>
  //         <style>${this.voucherStyles}</style>
  //       </head>
  //       <body>
  //         ${this.voucherDiv.nativeElement.innerHTML}
  //         <script>
  //           window.onload = function() { window.print(); window.close(); };
  //         </script>
  //       </body> 
  //     </html>
  //   `);
  //   // printWindow?.document.close();
  // }

printPage() {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Voucher Print</title>
        <style>${this.voucherStyles}</style>
      </head>
      <body>
        ${this.voucherDiv.nativeElement.innerHTML}
      </body> 
    </html>
  `);

  printWindow.document.close(); // Important for loading images/styles

  // Use a slight timeout to ensure the browser has rendered the CSS before opening print dialog
  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }, 250);
}

  getPreviousMonthName(dateValue: any): string {
    if (!dateValue) return '';
    const date = new Date(dateValue);
    date.setMonth(date.getMonth() - 1);
    return date.toLocaleString('default', { month: 'long' });
  }

  numberWithCommas(x: any) { return (Number(x) || 0).toLocaleString('en-IN'); }

  modeLabel(mode: any) {
    const modes: any = { 1: 'Online', 2: 'Cheque', 3: 'NEFT', 4: 'UPI', 5: 'IMPS', 6: 'RTGS' };
    return modes[mode] || '---';
  }

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
    const size = 3;
    const chunks = [];
    for (let i = 0; i < this.voucherList.length; i += size) {
      chunks.push(this.voucherList.slice(i, i + size));
    }
    return chunks;
  }
}