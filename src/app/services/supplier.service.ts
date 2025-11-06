import { Injectable } from '@angular/core';
import { BaseService } from './base';


@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  constructor(private srv: BaseService) { }

  GetAllByPagination() {
    return this.srv.get(`Supplier/GetAllSupplier`);
  }
  Add(data:any) {
    return this.srv.post(data, "Supplier/CreateUpdateSupplier");
  }
  GetById(id:any) {
    // console.log("User ID", data);
    return this.srv.get(`Supplier/GetSupplierById?SupplierId=${id}`);
  }
  Delete(id:any) {
    // console.log("User ID", data);
    return this.srv.delete(`Supplier/DeleteSupplier?Id=${id}`);
  }
  AllBloodGroup() {
    return this.srv.get(`Supplier/GetAllBloodGroups`);
    
  }
  SearchSuppliers(data:any) {
    return this.srv.post(data, "Supplier/SuppliersSearch");
  }
}
