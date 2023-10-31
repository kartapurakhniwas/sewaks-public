import { Injectable } from '@angular/core';
import { BaseService } from './base';


@Injectable({
  providedIn: 'root',
})
export class Billservice {
  constructor(private srv: BaseService) { }

  GetAllByPagination() {
    return this.srv.get(`Bill/all`);
  }
  Add(data:any) {
    return this.srv.post(data, "Bill");
  }
  update(data:any) {
    return this.srv.put(data, "Bill");
  }
  GetById(id:any) {
    // console.log("User ID", data);
    return this.srv.get(`Bill/${id}`);
  }
  Delete(id:any) {
    // console.log("User ID", data);
    return this.srv.delete(`Bill/${id}`);
  }
  AllBloodGroup() {
    return this.srv.get(`Join/GetAllBloodGroups`);
    
  }
}
