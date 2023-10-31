import { Injectable } from "@angular/core";
//import { TruckListComponent } from "src/app/components/map/truck-list.component";
import { PublicComponent } from "../layout/public/public.component";
import { StorageService } from "./storage.service";

@Injectable({
  providedIn: 'root',
})
export class GlobalsX {
  constructor(st: StorageService) {
      

  }
  UserType :any ;
  authTocken: any;
  User: any;
  UserId: any;
  //tsr: TruckListComponent;
  username: string = '';

  
}
