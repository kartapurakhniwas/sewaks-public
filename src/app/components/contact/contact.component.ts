import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JoinService } from 'src/app/services/joinus.service';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html'
})
export class ContactComponent implements OnInit {

  constructor(private srv: JoinService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  
  Form = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    mobileNo: new FormControl(Validators.required),
    notes: new FormControl(''),
    referralSource: new FormControl('',Validators.required),
    status: new FormControl(2)
  } as any);

  save() {
    let self = this;
    let data = this.Form.value;
    data.mobileNo = String(data.mobileNo);
    if (this.Form.valid) {
      self.srv.Add(data).subscribe((m) => {
        if (m.respStatus) {
          this.Form.reset();
          this._snackBar.open("Thank you for contacting us, we will reach back to you in a short time!", "Okay", { 'duration': 3000 });
          // this.nav.navigateByUrl('/coa');
          // window.alert('Thank you for contacting us, we will reach back to you in a short time!');
        }
      });
    } else {
      for (let i in this.Form.controls) {
        this.Form.controls[i].markAsTouched();
      }
      console.log('error');
      // window.alert('Oops! Something went wrong!');
      this._snackBar.open("Please fill required fields", "Okay", { 'duration': 3000 });
    }
  }

 

}
