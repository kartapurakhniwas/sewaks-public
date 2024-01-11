import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JoinService } from 'src/app/services/joinus.service';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html'
})
export class ContactComponent implements OnInit {

  policyCheck: boolean = false;

  constructor(private srv: JoinService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  
  Form = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    mobileNo: new FormControl(null as any,Validators.required),
    notes: new FormControl(''),
    referralSource: new FormControl('',Validators.required),
    status: new FormControl(2)
  } as any);

  save() {
    let self = this;
    let data = this.Form.value;
    data.mobileNo = String(data.mobileNo);
    if (this.Form.valid) {
      if (this.policyCheck) {
        self.srv.Add(data).subscribe((m) => {
          if (m.respStatus) {
            this.Form.reset();
            this._snackBar.open("Thank you for contacting us, we will reach back to you in a short time!", "Okay", { 'duration': 3000 });
            this.policyCheck = false;
          }
        });
      } else {
        this._snackBar.open("Please read and mark Terms of service & Private Policy", "Okay", { 'duration': 3000 });
      }
    } else {
      for (let i in this.Form.controls) {
        this.Form.controls[i].markAsTouched();
      }
      this._snackBar.open("Please fill required fields", "Okay", { 'duration': 3000 });
    }
  }

  check(event:any) {
    if (event.target.checked) {
      this.policyCheck = true;
    } else {
      this.policyCheck = false;
    }
  }

 

}
