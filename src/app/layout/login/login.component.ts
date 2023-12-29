import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from "@angular/router";
import { AuthService, MasterService, StorageService } from 'src/app/services';
// import * as CryptoJS from 'angular-crypto-js';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  error = null;
  userForm = new FormGroup({
    username: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required),
  });
  Error: any;
  token: any;
  storage: any;
  loginLoader: boolean = false;
  passCheck: any = 'password';

  constructor(
    private nav: Router,  
    private srv: AuthService,
    public master: MasterService,
    private st: StorageService, 
    public gl: MasterService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.st.remove("listoken");
    this.st.remove("userDetail");
  }

  Authenticate() {
    console.log(this.userForm.valid);
    this.Error = undefined;

    this.loginLoader = true;
    
    if (this.userForm.valid) {
      console.log(this.userForm.value, "this.userForm.value");
      
      this.srv.Login(this.userForm.value).subscribe((m:any) => {
        console.log(m);
        if (m.respStatus) {
          this.master.CurrentUser = m.model;
          this.st.add("listoken", m.respMsg);
          this.st.add("userDetail", m.model);
          this.nav.navigateByUrl("/admin/donations");
          this.loginLoader = false;
        } else {
          this._snackBar.open("Email ID or Password is not valid!", "Okay", { 'duration': 3000 });
          // window.alert('Email ID or Password is not valid');
          this.loginLoader = false;
        }
      });
    }
  }

  passChange() {
    if (this.passCheck == 'text') {
      this.passCheck = 'password';
    } else {
      this.passCheck = 'text';
    }
  }

}
