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
  setRowData1: any;
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
  
}
