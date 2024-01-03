import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/services';
import { CustomAlertService } from 'src/shared/alert.service';
import { DonationService } from 'src/app/services/donations.service';
import { VolunteerService } from 'src/app/services/volunteer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { findInvalidControls } from 'src/app/services/globalFunctions';
@Component({
  selector: 'app-add-donations',
  templateUrl: './add-donations.component.html',
  styleUrls: ['../style.scss']
})
export class AddDonationsComponent implements OnInit {
 
  mode: any[] = [

    { value: 2, viewValue: "Cheque" },
    { value: 3, viewValue: "NEFT" },
    { value: 4, viewValue: "UPI" },
    { value: 5, viewValue: "IMPS" },
    { value: 6, viewValue: "RTGS" },
    
  ];

  Form:any = new FormGroup({
    id: new FormControl(0),
    donorName: new FormControl("",Validators.required),
    donorId: new FormControl(null as any,Validators.required),
    donorAddress: new FormControl(""),
    receiptNo: new FormControl("",Validators.required),
    receiptDate: new FormControl(new Date(),Validators.required),
    receiptAmount: new FormControl(null as any,Validators.required),
    bankAmount: new FormControl(null as any,Validators.required),
    mode: new FormControl(null as any,Validators.required),
    image: new FormControl(""),
    comments: new FormControl(""),
    dateofBankCredit: new FormControl("",Validators.required),
    status: new FormControl(1),
  });

  dummy_date: any = new Date(2020, 3, 1);
  modeSelected: any;
  itemListFlag: boolean = false;
  volList: any = [];

  constructor(public gl: MasterService, private srv: DonationService, private nav: Router,
    private customAlertService: CustomAlertService,  private vol: VolunteerService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.refresh()
  }

  refresh() {
    console.log(this.gl.setRowDataArray, "this.gl.setRowDatathis.gl.setRowDatathis.gl.setRowData");
    
    if(this.gl.setRowDataArray[0]) {
      this.GetByID();
    }
    
  }

  GetByID() {
    let self = this;
    self.srv.GetById(this.gl.setRowDataArray[0].id).subscribe((m:any) => {
      if (m.respStatus) {
        this.setValue(m.model);
      }
    });
  }

  setValue(data:any) {
    this.Form.controls["donorName"].setValue(data?.donorName);
    this.Form.controls["donorId"].setValue(data?.donorId);
    this.Form.controls["receiptNo"].setValue(data?.receiptNo);
    this.Form.controls["receiptDate"].setValue(data?.receiptDate);
    this.Form.controls["receiptAmount"].setValue(data?.receiptAmount);
    this.Form.controls["bankAmount"].setValue(data?.bankAmount);
    this.Form.controls["mode"].setValue(data?.mode);
    this.Form.controls["image"].setValue(data?.image);
    this.Form.controls["comments"].setValue(data?.comments);
    this.Form.controls["dateofBankCredit"].setValue(data?.dateofBankCredit);
  }

  add() {
    let self = this;
    let data = this.Form.value;
    data.mode = Number(data.mode);
    
    if (this.Form.valid) {
      self.srv.Add(data).subscribe((m) => {
        const a = console.log(this.Form.value);
        if (m.respStatus) {
          this.Form.reset();
          this._snackBar.open('New donation added successfully', "Okay", {
            duration: 3000,
          });
        }
      });
    } else {
      for (let i in this.Form.controls) {
        this.Form.controls[i].markAsTouched();
      }
      this._snackBar.open('Please fill required fields', "Okay", {
        duration: 3000,
      });
    }

  }
  update() {
    let data =this.Form.value;
    let data1 = JSON.parse(JSON.stringify(data));
    data1.id = this.gl.setRowDataArray[0].id;
    if (this.Form.valid) {
      this.srv.update(data1).subscribe((m) => {
        if (m.respStatus) {
          this.nav.navigateByUrl("/admin/donations");
          this.Form.reset();
          this._snackBar.open('Selected donation updated successfully', "Okay", {
            duration: 3000,
          });
        }
      });
    } else {
      for (let i in this.Form.controls) {
        this.Form.controls[i].markAsTouched();
      }
      this._snackBar.open('Please fill required fields', "Okay", {
        duration: 3000,
      });
    }
  }
  
  onModeSelect(mode:any) {
    this.modeSelected = mode;
    console.log(mode, "modeee");
  }

  save() {
    console.log(this.Form.valid, "this.Form.valid", findInvalidControls(this.Form.controls));
    if (this.gl.setRowDataArray[0] != undefined) {
      this.update();
    } else {
      this.add();
    }
  }

  itemChangeKeyup(event:any) {
    this.Form.controls['donorName'].setErrors({'incorrect': true});
    let self = this;
    if (event.target.value == '') {
      this.itemListFlag = false;
    } else {
      this.itemListFlag = true;
      let data = {
        "firstName": event.target.value,
        "referedById": 0,
        "bloodGroupTypeId": 0,
        "pageNumber": 1,
        "pageSize": 10000,
        "donationMoney": 0
      }

      // USABLE
      self.vol.SearchVol(data).subscribe((m: any) => {
        if (m.respStatus) {
          console.log(m);
          this.volList = m.lstModel;
        } else {
          this.volList = []
        }
      });
    }
  }

  itemSelected(selected:any) {
    let self = this;
    console.log(selected);
    if (selected) {
      let name = selected.firstName + ' ' + selected.lastName;
      this.itemListFlag = false;
      // this.Form.controls["referedById"].setValue(selected?.volunteerID);
      this.Form.controls["donorName"].setValue(name);
      this.Form.controls["donorId"].setValue(selected.volunteerID);
      // this.Form.controls['donorName'].setErrors({'incorrect': false});
      this.Form.controls['donorName'].valid;
      this.Form.controls['donorName'].markAsPristine();
    }
  }

 
}