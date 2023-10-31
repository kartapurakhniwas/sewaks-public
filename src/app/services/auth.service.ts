import { Injectable } from '@angular/core';
import { BaseService } from './base';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private srv: BaseService) {}

  public GetAll() {
    return this.srv.get("Appuser/all");
  }
  public GetPaged(Id:any) {
    return this.srv.get('AppUser/paged/' + Id);
  }  
  public GetById(Id:any) {
    return this.srv.get('AppUser/' + Id);
  }
  public Add(data:any) {
    return this.srv.post(data,"AppUser");
  }
  public ChangePassword(data:any) {
    return this.srv.post(data,"AppUser/ChangePassword");
  }
  public ForgetPassword(data:any) {
    return this.srv.post(data,"AppUser/ChangePassword");
  }
  public Update(data:any) {
    return this.srv.put(data,"AppUser");
  }
  public Delete(Id:any) {
    return this.srv.delete('AppUser/' + Id);
  }
  public Login(data:any) {
    return this.srv.post(data, 'User/Login');
  }
  public PassAdmin(data:any) {
    return this.srv.post(data, 'AppUser/UpdatePassByAdmin');
  }
  public GetCompanyProfile() {
    return this.srv.get('AppUser/GetCompanyProfile');
  }

  public AddCompanyProfile(data:any) {
    return this.srv.post(data,"AppUser/InsertCompanyProfile");
  }
}
