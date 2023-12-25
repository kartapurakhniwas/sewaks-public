import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { StorageService } from 'src/app/services';
@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit {
  sidebarFlag: boolean = false;
  user: any;
  constructor(private st: StorageService,private nav: Router) {
    // if (this.st.get("userDetail") == null || undefined) {
    //   this.nav.navigateByUrl("/");
    // }
  }

  ngOnInit(): void {
    this.user = this.st.get("userDetail");
  }

  toggleSidebar() {
    this.sidebarFlag = !this.sidebarFlag;
    if (this.sidebarFlag == true) {
      this.st.add("sidebarFlag", true);
    } else {
      this.st.add("sidebarFlag", false);
    }
  }

  logout() {
    this.st.remove("listoken");
    this.st.remove("userDetail");
    this.nav.navigateByUrl("/");
  }

}
