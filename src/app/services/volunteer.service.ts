import { Injectable } from '@angular/core';
import { BaseService } from './base';


@Injectable({
  providedIn: 'root',
})
export class VolunteerService {
  constructor(private srv: BaseService) { }

  GetAllByPagination() {
    return this.srv.get(`Volunteer/GetAllVolunteer`);
  }
  Add(data:any) {
    return this.srv.post(data, "Volunteer/AddUpdateVolunteer");
  }
  update(data:any) {
    return this.srv.put(data, "Volunteer/AddUpdateVolunteer");
  }
  GetById(id:any) {
    // console.log("User ID", data);
    return this.srv.get(`Volunteer/GetVolunteerById?VolunteerId=${id}`);
  }
  Delete(id:any) {
    // console.log("User ID", data);
    return this.srv.delete(`Volunteer?VolunteerId=${id}`);
  }
  AllBloodGroup() {
    return this.srv.get(`Volunteer/GetAllBloodGroups`);
    
  }
  SearchVol(data:any) {
    return this.srv.post(data, "Volunteer/VolunteersSearch");
  }
}
