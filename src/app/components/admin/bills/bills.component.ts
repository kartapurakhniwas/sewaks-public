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
export class PrintVoucherPopup {
  @ViewChild('voucherDiv') voucherDiv: ElementRef = null as any;
  voucherList: any[] = [];
  // private voucherStyles = `
  //    * { margin:0; padding:0; box-sizing:border-box; }
  //    body { font-family: Arial, sans-serif; padding:20px; background:#f5f5f5; }
  //    .voucher-container { width:210mm; min-height:148mm; margin:0 auto; background:#fff; border:3px solid #000; position:relative; }
  //    .voucher-wrapper { display:flex; height:100%; }
  //    .sidebar { width:100px; border-right:3px solid #000; display:flex; flex-direction:column; position:relative; }
  //    .sidebar-inner { display:flex; flex-direction:column; height:100%; }
  //    .logo-section { border-bottom:2px solid #000; padding:15px 10px; text-align:center; }
  //    .logo-box { width:70px; height:70px; border:2px solid #000; margin:0 auto; display:flex; align-items:center; justify-content:center; font-size:10px; }
  //    .sidebar-text-container { flex:1; display:flex; align-items:center; justify-content:center; padding:20px 5px; }
  //    .sidebar-text { writing-mode: vertical-rl; transform: rotate(180deg); font-size:13px; letter-spacing:2px; font-weight:bold; text-align:center; }
  //    .main-content { flex:1; padding:25px 30px; display:flex; flex-direction:column; }
  //    .header-section { margin-bottom:15px; }
  //    .voucher-title { text-align:center; font-size:32px; font-weight:bold; color:#6B4423; letter-spacing:4px; margin-bottom:20px; text-decoration:underline; text-underline-offset:5px; }
  //    .firm-row { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:8px; font-size:14px; }
  //    .firm-label { font-weight:normal; }
  //    .firm-value { font-weight:bold; color:#0047AB; min-width:350px; border-bottom:1px solid #000; padding:2px 5px; text-align:center; }
  //    .meta-group { display:flex; gap:20px; align-items:baseline; }
  //   .meta-item { display:flex; align-items:baseline; gap:5px; }
  //    .meta-value { min-width:120px; border-bottom:1px solid #000; padding:2px 5px; }
  //    .particulars-section { margin-top:10px; flex:1; display:flex; flex-direction:column; }
  //    .particulars-header { text-align:center; font-size:16px; font-weight:bold; color:#6B4423; letter-spacing:3px; padding:5px 0; border-top:3px solid #6B4423; border-bottom:3px solid #6B4423; position:relative; margin-bottom:0; }
  //    .particulars-header::before { content:\"\"; position:absolute; left:0; right:0; top:2px; height:1px; background-color:#6B4423; }
  //    .particulars-header::after { content:\"\"; position:absolute; left:0; right:0; bottom:2px; height:1px; background-color:#6B4423; }
  //    .particulars-table { border-left:2px solid #000; border-right:2px solid #000; border-bottom:2px solid #000; flex:1; display:flex; flex-direction:column; }
  //    .table-header { display:flex; border-bottom:2px solid #000; }
  //    .header-description { flex:1; }
  //    .header-amount { width:100px; text-align:center; font-weight:bold; padding:5px; border-left:2px solid #000; font-size:14px; }
  //    .section { display:flex; flex-direction:column; flex:1; }
  //    .section-header { display:flex; border-bottom:2px solid #000; }
  //    .section-title { flex:1; font-weight:bold; padding:5px 10px; font-size:14px; color:#6B4423; }
  //    .section-rows { display:flex; flex-direction:column; flex:1; }
  //    .entry-row { display:flex; border-bottom:1px solid #999; min-height:35px; }
  //    .entry-row:last-child { border-bottom:2px solid #000; }
  //    .row-description { flex:1; padding:5px 10px; font-size:13px; display:flex; align-items:center; }
  //    .row-rupees, .row-paisa { width:100px; padding:5px 10px; text-align:right; border-left:2px solid #000; font-size:13px; display:flex; align-items:center; justify-content:flex-end; }
  //    .total-row { display:flex; border-top:2px solid #000; font-weight:bold; background-color:#f9f9f9; }
  //    .total-label { flex:1; padding:8px 10px; text-align:right; font-size:14px; }
  //    .footer-section { margin-top:25px; padding-top:15px; }
  //    .approval-row { margin-bottom:15px; }
  //    .signature-row { display:flex; justify-content:space-between; gap:40px; }
  //    .signature-block { flex:1; }
  //    .signature-label { font-size:13px; margin-bottom:3px; color:#6B4423; }
  //    .signature-value { border-bottom:2px solid #000; min-height:35px; padding:5px; font-weight:bold; color:#0047AB; }
  //    .signature-subtitle { font-size:11px; color:#0047AB; margin-top:2px; font-weight:bold; }
  //    @media print { body { padding:0; background:white; } .voucher-container { margin:0; border:3px solid #000; } .pagebreak { page-break-before: always; } }
  //  `;

  constructor(
    public gl: MasterService,
    public datepipe: DatePipe,
    public dialogRef: MatDialogRef<PrintVoucherPopup>
  ) {}

  ngOnInit(): void {
    this.buildVouchers();
  }

  buildVouchers() {
    const rows = this.gl.setRowDataArray || [];
    this.voucherList = rows.map((bill: any) => {
      const amount = Number(bill?.billAmount || 0);
      return {
        firmName: "SEWAKS' CHARITABLE TRUST",
        voucherNo: bill?.billNo || '',
        date: this.datepipe.transform(bill?.billDate, 'dd/MM/yyyy') || '',
        debitEntries: [
          { description: `Payment to ${bill?.supplierName || ''}`, rupees: this.numberWithCommas(amount), paisa: '/-' },
          { description: bill?.comments || '', rupees: '', paisa: '' },
          { description: '', rupees: '', paisa: '' }
        ],
        debitTotal: { rupees: this.numberWithCommas(amount), paisa: '/-' },
        creditEntries: [
          { description: this.modeLabel(bill?.mode), rupees: this.numberWithCommas(amount), paisa: '/-' },
          { description: `Bill No: ${bill?.billNo || ''}`, rupees: '', paisa: '' },
          { description: '', rupees: '', paisa: '' }
        ],
        creditTotal: { rupees: this.numberWithCommas(amount), paisa: '/-' },
        approvalLabel: "For SEWAKS' CHARITABLE TRUST\nApproved by",
        approvedBy: "__________________",
        approvalSubtitle: "Chairman/Treasurer/Secy. General/Trustee",
        signature: "",
        signatureSubtitle: "",
        receiverSignature: bill?.supplierName || ''
      };
    });
  }

  modeLabel(mode: any) {
    switch (mode) {
      case 1: return 'Online';
      case 2: return 'Cheque';
      case 3: return 'NEFT';
      case 4: return 'UPI';
      case 5: return 'IMPS';
      case 6: return 'RTGS';
      default: return '---';
    }
  }

  numberWithCommas(x: any) {
    const n = Number(x) || 0;
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  //  printPage() {
  //    const html = `
  //     <!DOCTYPE html>
  //     <html>
  //       <head>
  //         <title>Voucher</title>
  //         <style>${this.voucherStyles}</style>
  //       </head>
  //       <body>${this.voucherDiv.nativeElement.innerHTML}</body>
  //     </html>`;

  //   const popupWin: any = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
  //   popupWin.document.open();
  //   popupWin.document.write(html);
  //   popupWin.document.close();
  //   popupWin.focus();
  //   setTimeout(() => { popupWin.print(); popupWin.close(); }, 100);
  // }

  onNoClick(): void {
    this.dialogRef.close('');
  }


private voucherStyles = `
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Arial, sans-serif; background:#fff; }
  
  /* A4 is 297mm high. 140mm allows 2 per page with a small gap */
  .voucher-container { 
    width: 200mm; 
    height: 140mm; 
    margin: 2mm auto; 
    background: #fff; 
    border: 3px solid #000; 
    position: relative;
    overflow: hidden;
    display: block;
    page-break-inside: avoid;
  }
  
  .voucher-wrapper { display: flex; height: 100%; }
  
  /* Sidebar: Slightly narrower */
  .sidebar { width: 80px; border-right: 3px solid #000; display: flex; flex-direction: column; }
  .logo-section { border-bottom: 2px solid #000; padding: 10px 5px; text-align: center; }
  .logo-box { width: 60px; height: 60px; border: 2px solid #000; margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 9px; }
  .sidebar-text { writing-mode: vertical-rl; transform: rotate(180deg); font-size: 12px; font-weight: bold; text-align: center; white-space: nowrap; }

  .main-content { flex: 1; padding: 10px 20px; display: flex; flex-direction: column; }
  
  /* Header: Reduced margins */
  .voucher-title { text-align: center; font-size: 24px; font-weight: bold; color: #6B4423; letter-spacing: 2px; margin-bottom: 10px; text-decoration: underline; }
  
  .firm-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5px; font-size: 13px; }
  .firm-value { font-weight: bold; color: #0047AB; flex: 1; border-bottom: 1px solid #000; margin: 0 10px; text-align: center; }
  
  .meta-group { display: flex; gap: 15px; font-size: 13px; margin-bottom: 5px; }
  .meta-value { border-bottom: 1px solid #000; padding: 0 5px; min-width: 80px; text-align: center; }

  /* Particulars: Using flex-grow to fill middle space */
  .particulars-section { margin-top: 5px; flex-grow: 1; display: flex; flex-direction: column; }
  .particulars-header { text-align: center; font-size: 14px; font-weight: bold; color: #6B4423; border-top: 3px solid #6B4423; border-bottom: 3px solid #6B4423; padding: 2px 0; }
  
  .particulars-table { border: 2px solid #000; border-top: none; flex: 1; }
  .table-header { display: flex; border-bottom: 2px solid #000; background: #eee; font-size: 12px; }
  .row-description { flex: 1; padding: 4px 8px; font-size: 12px; border-right: 2px solid #000; }
  .row-amount { width: 90px; padding: 4px; text-align: right; font-size: 12px; font-weight: bold; }
  
  .entry-row { display: flex; border-bottom: 1px solid #ddd; min-height: 28px; }
  .total-row { display: flex; border-top: 2px solid #000; font-weight: bold; background: #f9f9f9; }

  /* Footer: Compact Signature Blocks */
  .footer-section { margin-top: 8px; }
  .signature-row { display: flex; justify-content: space-between; gap: 15px; }
  .signature-block { flex: 1; text-align: center; }
  .signature-label { font-size: 11px; color: #6B4423; font-weight: bold; margin-bottom: 2px; }
  .signature-value { border-bottom: 1px solid #000; min-height: 25px; font-size: 12px; padding-top: 5px; }
  .signature-subtitle { font-size: 10px; color: #0047AB; font-weight: bold; }

  @media print {
    @page { size: A4; margin: 0.5cm; }
    body { padding: 0; }
    .voucher-container { margin-bottom: 5mm; }
    /* Force page break after every 2 vouchers */
    .voucher-container:nth-child(2n) { page-break-after: always; }
  }
`;

printPage() {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Vouchers</title>
        <style>${this.voucherStyles}</style>
      </head>
      <body>
        ${this.voucherDiv.nativeElement.innerHTML}
      </body>
    </html>`;

  const popupWin = window.open('', '_blank', 'width=900,height=700');
  popupWin?.document.open();
  popupWin?.document.write(html);
  
  // Important: Wait for resources to load before printing
  popupWin?.document.close();
  popupWin!.onload = () => {
    popupWin?.focus();
    popupWin?.print();
    // popupWin?.close(); // Uncomment if you want it to auto-close
  };
}
}