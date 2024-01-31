import { Injectable } from "@angular/core";
import { BaseService } from "./base";
import { environment } from "../../environments/environment";
import { StorageService } from "./storage.service";
import { IfStmt } from "@angular/compiler";
@Injectable({
  providedIn: 'root',
})
export class MasterService {
  sidebar: boolean = false;
  setRowData: any = null;
  setPaymentData: any = null;
  setRowDataArray: any = [];
  token: string = '';
  selectedWarehouse: any;
  selectedClient: any;
  warehouseList: any;
  clientList: any;
  shippingOrders = [];
  constructor(private st: StorageService) { }
  editData: any;
  CurrentUser: any;
  Id: number = NaN;
  SelectedLocation: any;
  CurrentProvider: any;
  CurrentCustomer: any;
  PaymentRecord: any = [];
  Types: any = [];
  IsOpenMenu: boolean = true;
  Processing: boolean = false;
  theme = 'light-theme';
  rowMasterdata: any;
  AllPatients: any = [];
  selectedWarehouseName: any;
  selectedClientName: any;
  productlist: any;
  pad(num: number, size: number): string {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }
  UserPermission: any = [];

  hasPermission(Url:any) {
    if (environment.production == false) return true;
    this.CurrentUser = this.st.get("listoken");
    var dd = this.CurrentUser.UserPermission.filter((m:any) => m.url == Url);
    console.log(Url, dd);
    if (dd.length > 0) return true;
    else return false;
  }

  hasUrlPermission(Url:any) {

    this.UserPermission = this.st.get("usertasks");
    var dd = this.UserPermission.filter((m:any) => m.url == Url);
    // console.log(dd);

    if (dd.length > 0) return true;
    else return false;
  }

  printReceipt(printContents:any) {
    return `
    <style>
    .divider {
      height: 1px;
      border-bottom: 1px dashed #000;
      margin-top: 5px;
      margin-bottom: 5px;
    }
    @media print {
      .pagebreak { page-break-before: always; } /* page-break-after works, as well */
  }
    h1,h2,h3,h4,h5,h6 {
        margin-bottom: 0px;
        margin-top: 2px;
    }
    .wrap {
        max-width: 1000px;
        margin: auto;
    }
    .d-flex {
        display: flex;
    }
    .d-flex > div {
        width: 33.33%
    }
    .align-items-center {
        align-items: center;
    }
    .justify-content-between {
        justify-content: space-between;
    }
    .text-center {
        text-align: center
    }
    .text-left {
        text-align: left
    }
    .text-right {
        text-align: right
    }
    .iso {
        //background-color: #000000;
        color: #000;
       // padding: 3px 6px;
       // border-radius: 5px;
        font-size: 13px
    }
    .boxed {
      text-align: center;
      display: inline-block;
      border: 2px solid #000000;
      padding: 5px 10px;
      border-radius: 5px;
      font-size: 12px;
      line-height: 1.6;
      font-weight: 800;
      color: #000;
    }
    .rupees {
        font-size: 30px;
        border: 2px solid #000000;
        padding: 2px 7px;
        border-radius: 5px;
    }
</style>
<div [innerHTML]=${printContents}</div>

    `
  }
  
}
