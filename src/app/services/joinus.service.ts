import { Injectable } from '@angular/core';
import { BaseService } from './base';


@Injectable({
  providedIn: 'root',
})
export class JoinService {
  constructor(private srv: BaseService) { }

  GetAllByPagination() {
    return this.srv.get(`JoinUs/GetAllJoinUsData`);
  }
  Add(data:any) {
    return this.srv.post(data, "JoinUs/PostJoinUs");
  }
  update(data:any) {
    return this.srv.put(data, "JoinUs/UpdateJoinUs");
  }
  GetById(id:any) {
    // console.log("User ID", data);
    return this.srv.get(`Join/GetJoinById?JoinId=${id}`);
  }
  Delete(id:any) {
    // console.log("User ID", data);
    return this.srv.delete(`JoinUs/DeleteJoinUs?JoinId=${id}`);
  }
  AllBloodGroup() {
    return this.srv.get(`Join/GetAllBloodGroups`);
    
  }
}
