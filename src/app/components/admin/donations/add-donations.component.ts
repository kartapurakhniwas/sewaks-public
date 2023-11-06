import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/services';
import { CustomAlertService } from 'src/shared/alert.service';
import { DonationService } from 'src/app/services/donations.service';
import { VolunteerService } from 'src/app/services/volunteer.service';
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

  Form = new FormGroup({
    donorName: new FormControl("",Validators.required),
    receiptNo: new FormControl("",Validators.required),
    receiptDate: new FormControl(new Date(),Validators.required),
    receiptAmount: new FormControl(Validators.required),
    bankAmount: new FormControl(Validators.required),
    mode: new FormControl(1,Validators.required),
    image: new FormControl("",Validators.required),
    comments: new FormControl(""),
    dateofBankCredit: new FormControl("",Validators.required)
   
  });

  dummy_date: any = new Date(2020, 3, 1);
  modeSelected: any;
  itemListFlag: boolean = false;
  volList: any = [];

  constructor(public gl: MasterService, private srv: DonationService, private nav: Router,
    private customAlertService: CustomAlertService,  private vol: VolunteerService,) { }

  ngOnInit(): void {
    this.refresh()
  }

  refresh() {
    console.log(this.gl.setRowData, "this.gl.setRowDatathis.gl.setRowDatathis.gl.setRowData");
    
    if(this.gl.setRowData) {
      this.GetByID();
    }
    
  }

  GetByID() {
    let self = this;
    self.srv.GetById(this.gl.setRowData.id).subscribe((m:any) => {
      if (m.respStatus) {
        this.setValue(m.model);
      }
    });
  }

  setValue(data:any) {
    this.Form.controls["donorName"].setValue(data?.donorName);
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
    self.srv.Add(data).subscribe((m) => {
      const a = console.log(this.Form.value);
      if (m.respStatus) {
        this.nav.navigateByUrl("/donations");
        console.log(m.respStatus, "donation");
        this.Form.reset();
        // this._snackBar.open('New donation added successfully', "Okay", {
        //   duration: 3000,
        // });
      }
    });
  }
  update() {
    let data =this.Form.value;
    let data1 = JSON.parse(JSON.stringify(data));
    data1.id = this.gl.setRowData.id;
    this.srv.update(data1).subscribe((m) => {
      if (m.respStatus) {
        this.nav.navigateByUrl("/donations");
        console.log(m.respStatus, "paged");
        //this.updateFlag = false;
        this.Form.reset();
        // this._snackBar.open('Selected donation updated successfully', "Okay", {
        //   duration: 3000,
        // });
      }
    });
  }
  
  onModeSelect(mode:any) {
    this.modeSelected = mode;
    console.log(mode, "modeee");
  }

  save() {
    console.log('dfsdfdfg');
    
    if (this.gl.setRowData) {
      this.update();
    } else {
      this.add();
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
      // this.Form.controls["referedById"].setValue(selected?.volunteerID);
      this.Form.controls["donorName"].setValue(name);
    }
  }

 
}
