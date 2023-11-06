import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/services';
import { Billservice } from 'src/app/services/bills.service';
import * as saveAs from 'file-saver';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-add-Bills',
  templateUrl: './add-bills.component.html',
  styleUrls: ['../style.scss']
})
export class AddBillsComponent implements OnInit {
  billType : any[] = [
    { value: 1, viewValue: "Water" },
    { value: 2, viewValue: "Electricity" },
    { value: 3, viewValue: "Milk" },
    { value: 4, viewValue: "Grocery" },
    { value: 5, viewValue: "Miscellaneous" }
  ];
  
  status : any[] = [
    { value: 2, viewValue: "Pending" },
    { value: 1, viewValue: "Paid" }
  ];

  mode: any[] = [
    { value: 1, viewValue: "Cash" },
    { value: 2, viewValue: "Cheque" },
    { value: 3, viewValue: "NEFT" },

  ];

  Form = new FormGroup({
    supplierName: new FormControl('',Validators.required),
    billNo: new FormControl('',Validators.required),
    billDate: new FormControl('',Validators.required),
    billAmount: new FormControl('',Validators.required),
    dueDate: new FormControl('',Validators.required),
    billType: new FormControl(Validators.required),
    status: new FormControl(0, Validators.required),
    image: new FormControl('',Validators.required),
    comments: new FormControl(''),
    paymentDate: new FormControl('',Validators.required),
    mode: new FormControl(0, Validators.required),
    chequeNo: new FormControl('',Validators.required),
    chequeDate: new FormControl('',Validators.required),
    dateofBankDebit: new FormControl('',Validators.required),
    neftAmount: new FormControl(0,Validators.required),
    neftDate: new FormControl('',Validators.required)
  });

  dummy_date: any = new Date(2020, 3, 1);
  picture: string | undefined;
  chequeFlag: boolean = false;
  cashFlag: boolean = false;
  neftFlag: boolean = false;
  uploadFilesData: any = [];

  constructor(public gl: MasterService, private srv: Billservice, private nav: Router, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    if (this.gl.setRowData) {
      this.GetByID();
    }
  }  

  GetByID() {
    let self = this;
    self.srv.GetById(this.gl.setRowData.id).subscribe((m:any) => {
      if (m.respStatus) {
        this.setValue(m.lstModel[0]);
      }
    });
  }

  setValue(data:any) {
    this.Form.controls["supplierName"].setValue(data?.supplierName);
    this.Form.controls["billNo"].setValue(data?.billNo);
    this.Form.controls["billDate"].setValue(data?.billDate);
    this.Form.controls["billAmount"].setValue(data?.billAmount);
    this.Form.controls["dueDate"].setValue(data?.dueDate);
    this.Form.controls["billType"].setValue(data?.billType);
    this.Form.controls["status"].setValue(data?.status);
    this.Form.controls["image"].setValue(data?.image);
    this.Form.controls["comments"].setValue(data?.comments);
    this.Form.controls["paymentDate"].setValue(data?.paymentDate);
    this.Form.controls["mode"].setValue(data?.mode);
    this.Form.controls["chequeNo"].setValue(data?.chequeNo);
    this.Form.controls["chequeDate"].setValue(data?.chequeDate);
    this.Form.controls["dateofBankDebit"].setValue(data?.dateofBankDebit);
    this.Form.controls["neftAmount"].setValue(data?.neftAmount);
    this.Form.controls["neftDate"].setValue(data?.neftDate);
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
    console.log('asfd');
    let data = JSON.parse(JSON.stringify(this.Form.value));
    data.status = Number(data.status);
    data.mode = Number(data.mode);
    data.billDate = new Date(data.billDate);
    data.dueDate = new Date(data.dueDate);
    data.paymentDate = new Date(data.paymentDate);
    data.chequeDate = new Date(data.chequeDate);
    data.dateofBankDebit = new Date();
    data.neftDate = new Date(data.neftDate);
    data.image = JSON.stringify(this.uploadFilesData);

    if(data.mode == 1) {
          data.chequeNo = null;
          data.chequeDate = '0001-01-01';
          data.dateofBankDebit = '0001-01-01';
          data.neftAmount = 0;
          data.neftDate = '0001-01-01';
      }

      if(this.Form.value.mode == 2) {
        data.neftAmount = 0;
        data.neftDate = '0001-01-01';
      }

      if(this.Form.value.mode == 3){
        data.chequeNo = null;
        data.chequeDate = '0001-01-01';
      }
    
    //this.Form.controls["status"].setValue(1);
    // this.Form.controls["clientid"].setValue(this.gl.selectedClient);
    let self = this;
    console.log(data, 'dataaaa');
    
    self.srv.Add(data).subscribe((m:any) => {
      if (m.respStatus) {
        this.nav.navigateByUrl("/bills");
        console.log(m.respStatus, "paged");
        this.Form.reset();
        // this._snackBar.open('New Bill added successfully', "Okay", {
        //   duration: 3000,
        // }
        // )
      }
    })
  }

  update() {
    console.log('asfd');

    if(this.Form.value.mode == 1)
    {this.Form.controls["chequeNo"].setValue("null");
    this.Form.controls["chequeDate"].setValue("0001-01-01");
    this.Form.controls["dateofBankDebit"].setValue("0001-01-01");
    this.Form.controls["neftAmount"].setValue(0);
    this.Form.controls["neftDate"].setValue("0001-01-01");
  }

  if(this.Form.value.mode == 2)
    {
    this.Form.controls["neftAmount"].setValue(0);
    this.Form.controls["neftDate"].setValue("0001-01-01");
  }

  if(this.Form.value.mode == 3)
    {this.Form.controls["chequeNo"].setValue("null");
    this.Form.controls["chequeDate"].setValue("0001-01-01");
  }
    
    //this.Form.controls["status"].setValue(1);
    // this.Form.controls["clientid"].setValue(this.gl.selectedClient);
    let self = this;
    self.srv.Add(this.Form.value).subscribe((m:any) => {
      if (m.respStatus) {
        this.nav.navigateByUrl("/bill");
        console.log(m.respStatus, "paged");
        this.Form.reset();
        // this._snackBar.open('New Bill added successfully', "Okay", {
        //   duration: 3000,
        // }
        // )
      }
    })
  }

  changePaymentMode(event:any) {
    this.cashFlag = false;
    this.chequeFlag = false;
    this.neftFlag = false;
    console.log(event.value);
    if (event.value == 1) {
      this.cashFlag = true;
    } else if (event.value == 2) {
      this.chequeFlag = true;
    } else {
      this.neftFlag = true
    }
  }

  invoiceDocument = new FormGroup({
    fileName: new FormControl(""),
    uploadDate: new FormControl(),
    fileData: new FormControl(),
    fileType: new FormControl()
  });

  upload(event:any) {
    let data = this.invoiceDocument.value;
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        data.fileName = event.target.files[0].name;
        data.uploadDate = new Date();
        data.fileData = reader.result;
        data.fileType = file.type;
        this.uploadFilesData.push(JSON.parse(JSON.stringify(data)));
    };
    console.log(this.uploadFilesData);
    
  }

  async downloadPhotos(data:any): Promise<void> {
    console.log(data, "dasfdg");
    
    const base64Data = data.fileData; // Replace with your base64 data

    const response = await fetch(base64Data);
    const blob = await response.blob();

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    a.href = url;
    a.download = data.fileName; // Replace with your desired file name
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  deletePhotos(i:any) {
    this.uploadFilesData.splice(i, 1);
    this._snackBar.open("Deleted Successfully!", "Okay", { 'duration': 3000 });
  }
}
 