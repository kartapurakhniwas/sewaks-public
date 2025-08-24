import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { MasterService } from 'src/app/services';
import { DonationService } from 'src/app/services/donations.service';
import { findInvalidControls } from 'src/app/services/globalFunctions';
import { VolunteerService } from 'src/app/services/volunteer.service';
import { CustomAlertService } from 'src/shared/alert.service';
@Component({
  selector: 'app-add-donations',
  templateUrl: './add-donations.component.html',
  styleUrls: ['../style.scss'],
})
export class AddDonationsComponent implements OnInit {
  mode: any[] = [
    { value: 2, viewValue: 'Cheque' },
    { value: 3, viewValue: 'Online' },
  ];

  Form: any = new FormGroup({
    id: new FormControl(0),
    donorName: new FormControl('', Validators.required),
    donorId: new FormControl(0),
    donorAddress: new FormControl(''),
    receiptNo: new FormControl('', Validators.required),
    receiptDate: new FormControl(new Date(), Validators.required),
    receiptAmount: new FormControl(null as any, Validators.required),
    bankAmount: new FormControl(0),
    mode: new FormControl(3, Validators.required),
    chequeNo: new FormControl(''),
    chequeDate: new FormControl(new Date()),
    image: new FormControl(''),
    comments: new FormControl(''),
    dateofBankCredit: new FormControl(new Date()),
    status: new FormControl(1),
  });

  dummy_date: any = new Date(2020, 3, 1);
  modeSelected: any;
  itemListFlag: boolean = false;
  volList: any = [];
  cashFlag: boolean = false;
  chequeFlag: boolean = false;
  neftFlag: boolean = false;

  constructor(
    public gl: MasterService,
    private srv: DonationService,
    private nav: Router,
    private customAlertService: CustomAlertService,
    private vol: VolunteerService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    console.log(
      this.gl.setRowDataArray,
      'this.gl.setRowDatathis.gl.setRowDatathis.gl.setRowData'
    );
    this.getAllDonationsForRecieptNo();
    if (this.gl.setRowDataArray[0]) {
      this.GetByID();
    }
  }

  GetByID() {
    let self = this;
    self.srv.GetById(this.gl.setRowDataArray[0].id).subscribe((m: any) => {
      if (m.respStatus) {
        this.setValue(m.model);
      }
    });
  }

  getAllDonationsForRecieptNo() {
    let self = this;
    self.srv.GetAllByPagination().subscribe((m:any) => {
        if (m.respStatus) {
          this.Form.controls['receiptNo'].setValue(Number(m.lstModel[0]?.receiptNo) + 1);
        }
      }
    );
  }

  setValue(data: any) {
    this.Form.controls['donorName'].setValue(data?.donorName);
    this.Form.controls['donorId'].setValue(data?.donorId);
    this.Form.controls['receiptNo'].setValue(data?.receiptNo);
    this.Form.controls['receiptDate'].setValue(data?.receiptDate);
    this.Form.controls['receiptAmount'].setValue(data?.receiptAmount);
    this.Form.controls['bankAmount'].setValue(data?.bankAmount);
    this.Form.controls['mode'].setValue(data?.mode);
    this.Form.controls['image'].setValue(data?.image);
    this.Form.controls['comments'].setValue(data?.comments);
    this.Form.controls['dateofBankCredit'].setValue(data?.dateofBankCredit);
  }

  add() {
    let self = this;
    let data = this.Form.value;
    data.mode = Number(data.mode);

    if (data.mode == 1) {
      data.chequeNo = null;
      // data.chequeDate = new Date();
      // data.dateofBankDebit = new Date();
      data.chequeDate = data.chequeDate ? moment(data.chequeDate).format('YYYY-MM-DDTHH:mm:ss') : moment(new Date()).format('YYYY-MM-DDTHH:mm:ss')
      data.dateofBankDebit = data.dateofBankDebit ? moment(data.dateofBankDebit).format('YYYY-MM-DDTHH:mm:ss') : moment(new Date()).format('YYYY-MM-DDTHH:mm:ss')
      data.neftAmount = '0';
      // data.neftDate = new Date();
      data.neftDate = data.neftDate ? moment(data.neftDate).format('YYYY-MM-DDTHH:mm:ss') : moment(new Date()).format('YYYY-MM-DDTHH:mm:ss')
    }

    if (this.Form.value.mode == 2) {
      data.neftAmount = '0';
      // data.neftDate = new Date();
      data.neftDate = data.neftDate ? moment(data.neftDate).format('YYYY-MM-DDTHH:mm:ss') : moment(new Date()).format('YYYY-MM-DDTHH:mm:ss')
      
    }

    if (this.Form.value.mode == 3) {
      data.chequeNo = '0';
      // data.chequeDate = new Date();
      data.chequeDate = data.chequeDate ? moment(data.chequeDate).format('YYYY-MM-DDTHH:mm:ss') : moment(new Date()).format('YYYY-MM-DDTHH:mm:ss')
    }

    console.log('🚀 ~ AddDonationsComponent ~ self.srv.Add ~ data:', data);
    
    if (this.Form.valid) {
      data.receiptDate = data.receiptDate ? moment(data.receiptDate).format('YYYY-MM-DDTHH:mm:ss') : moment(new Date()).format('YYYY-MM-DDTHH:mm:ss')
      self.srv.Add(data).subscribe((m) => {
        const a = console.log(this.Form.value);
        if (m.respStatus) {
          this.Form.reset();
          this._snackBar.open('New donation added successfully', 'Okay', {
            duration: 3000,
          });
          this.nav.navigateByUrl('/admin/donations');
        }
      });
    } else {
      for (let i in this.Form.controls) {
        this.Form.controls[i].markAsTouched();
      }
      this._snackBar.open('Please fill required fields', 'Okay', {
        duration: 3000,
      });
    }
  }
  update() {
    let data = this.Form.value;
    let data1 = JSON.parse(JSON.stringify(data));
    data1.id = this.gl.setRowDataArray[0].id;

    if (data.mode == 1) {
      data.chequeNo = null;
      // data.chequeDate = new Date();
      // data.dateofBankDebit = new Date();
      data.chequeDate = data.chequeDate ? moment(data.chequeDate).format('YYYY-MM-DDTHH:mm:ss') : moment(new Date()).format('YYYY-MM-DDTHH:mm:ss')
      data.dateofBankDebit = data.dateofBankDebit ? moment(data.dateofBankDebit).format('YYYY-MM-DDTHH:mm:ss') : moment(new Date()).format('YYYY-MM-DDTHH:mm:ss')
      data.neftAmount = '0';
      // data.neftDate = new Date();
      data.neftDate = data.neftDate ? moment(data.neftDate).format('YYYY-MM-DDTHH:mm:ss') : moment(new Date()).format('YYYY-MM-DDTHH:mm:ss')
    }

    if (this.Form.value.mode == 2) {
      data.neftAmount = '0';
      // data.neftDate = new Date();
      data.neftDate = data.neftDate ? moment(data.neftDate).format('YYYY-MM-DDTHH:mm:ss') : moment(new Date()).format('YYYY-MM-DDTHH:mm:ss')
      
    }

    if (this.Form.value.mode == 3) {
      data.chequeNo = '0';
      // data.chequeDate = new Date();
      data.chequeDate = data.chequeDate ? moment(data.chequeDate).format('YYYY-MM-DDTHH:mm:ss') : moment(new Date()).format('YYYY-MM-DDTHH:mm:ss')
    }
    if (this.Form.valid) {
      data1.receiptDate = data1.receiptDate ? moment(data1.receiptDate).format('YYYY-MM-DDTHH:mm:ss') : moment(new Date()).format('YYYY-MM-DDTHH:mm:ss')
      this.srv.update(data1).subscribe((m) => {
        if (m.respStatus) {
          this.nav.navigateByUrl('/admin/donations');
          this.Form.reset();
          this._snackBar.open(
            'Selected donation updated successfully',
            'Okay',
            {
              duration: 3000,
            }
          );
        }
      });
    } else {
      for (let i in this.Form.controls) {
        this.Form.controls[i].markAsTouched();
      }
      this._snackBar.open('Please fill required fields', 'Okay', {
        duration: 3000,
      });
    }
  }

  onModeSelect(mode: any) {
    this.modeSelected = mode;
    console.log(mode, 'modeee');
  }

  save() {
    console.log(
      this.Form.valid,
      'this.Form.valid',
      findInvalidControls(this.Form.controls)
    );
    if (this.gl.setRowDataArray[0] != undefined) {
      this.update();
    } else {
      this.add();
    }
  }

  itemChangeKeyup(event: any) {
    // this.Form.controls['donorName'].setErrors({'incorrect': true});
    let self = this;
    if (event.target.value == '') {
      this.itemListFlag = false;
    } else {
      this.itemListFlag = true;
      let data = {
        firstName: event.target.value,
        referedById: 0,
        bloodGroupTypeId: 0,
        pageNumber: 1,
        pageSize: 10000,
        donationMoney: 0,
      };

      // USABLE
      self.vol.SearchVol(data).subscribe((m: any) => {
        if (m.respStatus) {
          console.log(m);
          this.volList = m.lstModel;
        } else {
          this.volList = [];
        }
      });
    }
  }

  itemSelected(selected: any) {
    let self = this;
    console.log(selected);
    if (selected) {
      let name = selected.firstName + ' ' + selected.lastName;
      this.itemListFlag = false;
      // this.Form.controls["referedById"].setValue(selected?.volunteerID);
      this.Form.controls['donorName'].setValue(name);
      this.Form.controls['donorId'].setValue(selected.volunteerID);
      // this.Form.controls['donorName'].setErrors({'incorrect': false});
      this.Form.controls['donorName'].valid;
      this.Form.controls['donorName'].markAsPristine();
    }
  }

  changePaymentMode(event: any) {
    this.cashFlag = false;
    this.chequeFlag = false;
    this.neftFlag = false;
    console.log(event.value);
    if (event.value == 1) {
      this.cashFlag = true;
    } else if (event.value == 2) {
      this.chequeFlag = true;
    } else {
      this.neftFlag = true;
    }
  }
}
