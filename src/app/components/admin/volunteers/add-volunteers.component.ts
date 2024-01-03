import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/services';
import { VolunteerService } from 'src/app/services/volunteer.service';
import { CustomAlertService } from 'src/shared/alert.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-add-volunteers',
  templateUrl: './add-volunteers.component.html',
  styleUrls: ['../style.scss']
})
export class AddVolunteersComponent implements OnInit {
  selectedCar:any;
  bloodList: any;
  itemListFlag: boolean = false;
  volList: any = [];

  constructor(public gl: MasterService, private vol: VolunteerService, private nav: Router,
    private customAlertService: CustomAlertService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.refresh()
  }

  refresh() {
    this.GetBloodList();
    
  }
  
  GetBloodList() {
    let self = this;
    self.vol.AllBloodGroup().subscribe((m:any) => {
        if (m.respStatus) {
          this.bloodList = m.lstModel;
          this.GetVolList();
        }
      }
    );
  }

  GetVolList() {
    let self = this;
    self.vol.GetAllByPagination().subscribe((m:any) => {
      if (m.respStatus) {
        this.volList = m.lstModel;
        if (this.gl.setRowData) {
          this.GetByID();
        }
      }
    });
  }

  GetByID() {
    let self = this;
    self.vol.GetById(this.gl.setRowData.volunteerID).subscribe((m:any) => {
      if (m.respStatus) {
        this.setValue(m.lstModel[0]);
      }
    });
  }


  Form = new FormGroup({
    firstName: new FormControl('', Validators.required ),
    lastName: new FormControl('', Validators.required),
    dateOfBirth: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    primaryContact: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    panNo: new FormControl('', Validators.required),
    referedBy: new FormControl('', Validators.required),
    referedById: new FormControl(2,  {nonNullable: true}),
    donationMoney: new FormControl(0,  {nonNullable: true}),
    emailNotification: new FormControl(true,  {nonNullable: true}),
    notes: new FormControl(''),
    autoDebitSystem: new FormControl(false,  {nonNullable: true}),
    bloodGroupTypeId: new FormControl(1,   {nonNullable: true}),
    lastGivenDate: new FormControl(new Date, Validators.required),
    donationDate: new FormControl(''),
    joinDate: new FormControl(new Date, Validators.required),
    scheduleTypeId: new FormControl(1,  {nonNullable: true}),
    wantRebate: new FormControl(false,  {nonNullable: true}),
  } as any);

  setValue(data:any) {
    this.Form.controls["firstName"].setValue(data?.firstName);
    this.Form.controls["lastName"].setValue(data?.lastName);
    this.Form.controls["panNo"].setValue(data?.panNo);
    this.Form.controls["dateOfBirth"].setValue(data?.dateOfBirth);
    this.Form.controls["email"].setValue(data?.email);
    this.Form.controls["primaryContact"].setValue(data?.primaryContact);
    this.Form.controls["address"].setValue(data?.address);
    this.Form.controls["referedBy"].setValue(data?.referedBy);
    this.Form.controls["referedById"].setValue(data?.referedById);
    this.Form.controls["donationMoney"].setValue(data?.donationMoney);
    this.Form.controls["emailNotification"].setValue(data?.emailNotification);
    this.Form.controls["notes"].setValue(data?.notes);
    this.Form.controls["autoDebitSystem"].setValue(data?.autoDebitSystem);
    this.Form.controls["bloodGroupTypeId"].setValue(Number(data?.bloodGroupTypeId));
    this.Form.controls["lastGivenDate"].setValue(data?.lastGivenDate);
    this.Form.controls["donationDate"].setValue(data?.donationDate);
    this.Form.controls["joinDate"].setValue(data?.joinDate);
    this.Form.controls["scheduleTypeId"].setValue(data?.scheduleTypeId);
    this.Form.controls["wantRebate"].setValue(data?.wantRebate);
  }

  save() {
    console.log('dfsdfdfg');
    
    if (this.gl.setRowData) {
      this.update();
    } else {
      this.add();
    }
  }

  add() {
    let self = this;
    let data = this.Form.value;
    data.primaryContact = String(data.primaryContact);
    data.dateOfBirth = new Date(data.dateOfBirth);
    data.donationDate = new Date(data.donationDate);
    data.scheduleTypeId = Number(data.scheduleTypeId);
    data.bloodGroupTypeId = Number(data.bloodGroupTypeId);
    console.log(this.Form);
    
    if (this.Form.valid) {
      self.vol.Add(data).subscribe((m) => {
        if (m.respStatus) {
          this.Form.reset();
          this._snackBar.open("Added Successfully", "Okay", { 'duration': 3000 });
          this.nav.navigateByUrl('/admin/volunteers');
          // window.alert('Added Successfully');
        }
      });
    } else {
      for (let i in this.Form.controls) {
        this.Form.controls[i].markAsTouched();
      }
      
      this._snackBar.open("Please fill required fields", "Okay", { 'duration': 3000 });
    }
  }

  update() {
    let self = this;
    let data = this.Form.value;
    data.volunteerID = this.gl.setRowData.volunteerID;
    data.primaryContact = String(data.primaryContact);
    data.dateOfBirth = new Date(data.dateOfBirth);
    data.donationDate = new Date(data.donationDate);
    data.scheduleTypeId = Number(data.scheduleTypeId);
    data.bloodGroupTypeId = Number(data.bloodGroupTypeId);
    if (this.Form.valid) {
      self.vol.Add(data).subscribe((m) => {
        if (m.respStatus) {
          this.Form.reset();
          this._snackBar.open("Added Successfully", "Okay", { 'duration': 3000 });
          this.nav.navigateByUrl('/admin/volunteers');
          // this.nav.navigateByUrl('/volunteers');
          // window.alert('Update Successfully');
        }
      });
    } else {
      for (let i in this.Form.controls) {
        this.Form.controls[i].markAsTouched();
      }
      this._snackBar.open("Please fill required fields", "Okay", { 'duration': 3000 });
    }
  }

  itemChangeKeyup(event:any) {
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
      this.Form.controls["referedById"].setValue(selected?.volunteerID);
      this.Form.controls["referedBy"].setValue(name);
    }
  }

}
