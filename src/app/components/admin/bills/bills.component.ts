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

  printPage() {
    const popupWin: any = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(this.gl.printReceipt(this.voucherDiv.nativeElement.innerHTML));
    popupWin.print();
  }

  onNoClick(): void {
    this.dialogRef.close('');
  }
}