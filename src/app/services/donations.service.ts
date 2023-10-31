import { Injectable } from '@angular/core';
import { BaseService } from './base';


@Injectable({
  providedIn: 'root',
})
export class DonationService {
  constructor(private srv: BaseService) { }

  GetAllByPagination() {
    return this.srv.get(`Donation/all`);
  }
  Add(data:any) {
    return this.srv.post(data, "Donation");
  }
  update(data:any) {
    return this.srv.put(data, "Donation");
  }
  GetById(id:any) {
    // console.log("User ID", data);
    return this.srv.get(`Donation/${id}`);
  }
  Delete(id:any) {
    // console.log("User ID", data);
    return this.srv.delete(`Donation/${id}`);
  }
  AllBloodGroup() {
    return this.srv.get(`Join/GetAllBloodGroups`);
    
  }
}
