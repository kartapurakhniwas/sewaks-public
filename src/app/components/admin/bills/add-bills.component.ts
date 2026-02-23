import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import * as saveAs from 'file-saver';
import { firstValueFrom } from 'rxjs';
import { MasterService } from 'src/app/services';
import { Billservice } from 'src/app/services/bills.service';
import { SupplierService } from 'src/app/services/supplier.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-add-Bills',
  templateUrl: './add-bills.component.html',
  styleUrls: ['../style.scss'],
})
export class AddBillsComponent implements OnInit {
@ViewChild('supplierSearchInput') supplierSearchInput?: ElementRef<HTMLInputElement>;
  billType: any[] = [
    { value: 1, viewValue: 'Water' },
    { value: 2, viewValue: 'Electricity' },
    { value: 3, viewValue: 'Milk' },
    { value: 4, viewValue: 'Grocery' },
    { value: 5, viewValue: 'Miscellaneous' },
  ];

  status: any[] = [
    { value: 0, viewValue: 'Active' },
    { value: 2, viewValue: 'Pending' },
    { value: 1, viewValue: 'Paid' },
  ];

  mode: any[] = [
    { value: 1, viewValue: 'Online' },
    // { value: 2, viewValue: "Cash" }
    // { value: 3, viewValue: "NEFT" },
    // { value: 4, viewValue: "UPI" },
    // { value: 5, viewValue: "IMPS" },
    // { value: 6, viewValue: "RTGS" }
  ];

  imageList = [];

  Form = new FormGroup({
    supplierName: new FormControl('', Validators.required),
    supplierId: new FormControl(''),

    billNo: new FormControl(0),
    billDate: new FormControl(
      new Date().toISOString().substring(0, 10),
      Validators.required,
    ),
    billAmount: new FormControl('', Validators.required),
    dueDate: new FormControl(''),
    billType: new FormControl(1),
    status: new FormControl(1),
    image: new FormControl(''),
    comments: new FormControl(''),
    paymentDate: new FormControl(''),
    mode: new FormControl(1),
    chequeNo: new FormControl(''),
    chequeDate: new FormControl(''),
    dateofBankDebit: new FormControl(''),
    neftAmount: new FormControl(0),
    neftDate: new FormControl(''),
  });

  dummy_date: any = new Date(2020, 3, 1);
  picture: string | undefined;
  chequeFlag: boolean = false;
  cashFlag: boolean = false;
  neftFlag: boolean = false;
  uploadFilesData: any = [];
  itemListFlag: boolean = false;
  suppList: any[] = [];
  filteredSuppList: any[] = [];
  billId: any;

  constructor(
    private supp: SupplierService,
    public gl: MasterService,
    private srv: Billservice,
    private nav: Router,
    private _snackBar: MatSnackBar,
    private routeParam: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.billId = this.routeParam.snapshot.paramMap.get('billId');
    if (this.billId) {
      this.GetByID();
    } else {
      this.getBillNextNo();
    }
    // get suplliers name list
    this.getSupplier();
  }

  getBillNextNo() {
    let self = this;
    self.srv.GetAllByPagination().subscribe((m: any) => {
      if (m.respStatus) {
        this.Form.controls['billNo'].setValue(
          Number(m.lstModel[0]?.billNo) + 1,
        );
      }
    });
  }

  getSupplier() {
    let self = this;
    self.supp.GetAllByPagination().subscribe((m: any) => {
      if (m.respStatus) {
        this.suppList = m.lstModel;
        this.filteredSuppList = [...this.suppList];

        // this.Form.controls['billNo'].setValue(m.lstModel[0]?.billNo + 1);
      }
    });
  }

  GetByID() {
    let self = this;
    self.srv.GetById(this.billId).subscribe((m: any) => {
      if (m.respStatus) {
        this.setValue(m.model);
        console.log(m.model);
      }
    });
  }

  setValue(data: any) {
    this.Form.controls['supplierName'].setValue(data?.supplierName);
    this.Form.controls['billNo'].setValue(data?.billNo);
    this.Form.controls['billDate'].setValue(data?.billDate);
    this.Form.controls['billAmount'].setValue(data?.billAmount);
    this.Form.controls['dueDate'].setValue(data?.dueDate);
    this.Form.controls['billType'].setValue(data?.billType);
    this.Form.controls['status'].setValue(data?.status);
    this.Form.controls['image'].setValue(data?.image);
    this.Form.controls['comments'].setValue(data?.comments);
    this.Form.controls['paymentDate'].setValue(data?.paymentDate);
    this.Form.controls['mode'].setValue(data?.mode);
    this.Form.controls['chequeNo'].setValue(data?.chequeNo);
    this.Form.controls['chequeDate'].setValue(data?.chequeDate);
    this.Form.controls['dateofBankDebit'].setValue(data?.dateofBankDebit);
    this.Form.controls['neftAmount'].setValue(data?.neftAmount);
    this.Form.controls['neftDate'].setValue(data?.neftDate);

    this.uploadFilesData = JSON.parse(data?.image);
    //this.imageList = JSON.parse(data?.image);
  }

  save() {
    //console.log('dfsdfdfg');
    if (this.Form.valid) {
      if (this.billId) {
        this.update();
      } else {
        this.add();
      }
    } else {
      Object.keys(this.Form.controls).forEach((key) => {
        const control = this.Form.get(key);

        if (control?.invalid) {
          console.log(key, control.errors);
        }
      });

      // for (let i in this.Form.controls) {
      //   this.Form.controls[i].markAsTouched();
      // }
      this.Form.markAllAsTouched(); // show validation errors

      this._snackBar.open('Please fill required fields', 'Okay', {
        duration: 3000,
      });

      //return; // ⛔ stop API call
    }
  }

  add() {
    console.log('add');
    let data = JSON.parse(JSON.stringify(this.Form.value));
    data.status = Number(data.status);
    data.billNo = String(data.billNo);
    data.mode = Number(data.mode);
    data.billDate = new Date(data.billDate);
    data.dueDate = new Date(data.dueDate);
    data.paymentDate = new Date(data.paymentDate);
    data.chequeDate = new Date(data.chequeDate);
    data.dateofBankDebit = new Date();
    data.neftDate = new Date(data.neftDate);
    data.image = JSON.stringify(this.uploadFilesData);

    if (data.mode == 1) {
      data.chequeNo = null;
      data.chequeDate = '0001-01-01';
      data.dateofBankDebit = '0001-01-01';
      data.neftAmount = 0;
      data.neftDate = '0001-01-01';
    }

    if (this.Form.value.mode == 2) {
      data.neftAmount = 0;
      data.neftDate = '0001-01-01';
    }

    if (this.Form.value.mode == 3) {
      data.chequeNo = null;
      data.chequeDate = '0001-01-01';
    }

    //this.Form.controls["status"].setValue(1);
    // this.Form.controls["clientid"].setValue(this.gl.selectedClient);
    let self = this;
    console.log(data, 'dataaaa');

    self.srv.Add(data).subscribe((m: any) => {
      if (m.respStatus) {
        this.nav.navigateByUrl('/admin/bills');
        console.log(m.respStatus, 'paged');
        this.Form.reset();
        // this._snackBar.open('New Bill added successfully', "Okay", {
        //   duration: 3000,
        // }
        // )
      }
    });
  }

  update() {
    console.log('update');

    if (this.Form.value.mode == 1) {
      this.Form.controls['chequeNo'].setValue('null');
      this.Form.controls['chequeDate'].setValue('0001-01-01');
      this.Form.controls['dateofBankDebit'].setValue('0001-01-01');
      this.Form.controls['neftAmount'].setValue(0);
      this.Form.controls['neftDate'].setValue('0001-01-01');
    }

    if (this.Form.value.mode == 2) {
      this.Form.controls['neftAmount'].setValue(0);
      this.Form.controls['neftDate'].setValue('0001-01-01');
    }

    if (this.Form.value.mode == 3) {
      this.Form.controls['chequeNo'].setValue('null');
      this.Form.controls['chequeDate'].setValue('0001-01-01');
    }

    //this.Form.controls["status"].setValue(1);
    // this.Form.controls["clientid"].setValue(this.gl.selectedClient);

    let data = JSON.parse(JSON.stringify(this.Form.value));
    data.billNo = String(data.billNo);
    data.image = JSON.stringify(this.uploadFilesData);
    data.id = this.billId;
    let self = this;
    self.srv.update(data).subscribe((m: any) => {
      if (m.respStatus) {
        this.nav.navigateByUrl('/admin/bills');
        console.log(m.respStatus, 'paged');
        this.Form.reset();
        // this._snackBar.open('New Bill added successfully', "Okay", {
        //   duration: 3000,
        // }
        // )
      }
    });
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

  invoiceDocument = new FormGroup({
    fileName: new FormControl(''),
    uploadDate: new FormControl(),
    fileData: new FormControl(),
    fileType: new FormControl(),
  });

  upload(event: any) {
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

  async downloadPhotos(data: any): Promise<void> {
    console.log(data, 'dasfdg');

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

  deletePhotos(i: any) {
    if (confirm('Are you sure to remove this document ? ')) {
      this.uploadFilesData.splice(i, 1);
      //call update
      this.update();
      this._snackBar.open('Deleted Successfully!', 'Okay', { duration: 3000 });
    }
  }

  itemChangeKeyup(event: any) {
    const input = event.target.value.trim().toLowerCase();
    if (!input) {
      this.filteredSuppList = [...this.suppList];
      return;
    }
    this.filteredSuppList = this.suppList.filter((s) =>
      (s.supplierName || '').toLowerCase().includes(input),
    );
  }

  itemSelected(selectedName: string) {
    const selected = this.suppList.find((s) => s.supplierName === selectedName);
    if (selected) {
      this.Form.controls['supplierName'].setValue(selected.supplierName);
      this.Form.controls['supplierId'].setValue(selected.supplierId);
      this.Form.controls['supplierName'].markAsPristine();
    }
  }

  resetSupplierFilter() {
    this.filteredSuppList = [...this.suppList];
  }
  onSupplierOpened(opened: boolean) {
    if (opened) {
      // fresh list and focus the search box
      this.resetSupplierFilter();
      setTimeout(() => {
        if (this.supplierSearchInput) {
          this.supplierSearchInput.nativeElement.value = '';
          this.supplierSearchInput.nativeElement.focus();
        }
      }, 0);
    } else {
      // clear any typed text and restore full list
      if (this.supplierSearchInput) {
        this.supplierSearchInput.nativeElement.value = '';
      }
      this.resetSupplierFilter();
    }
  }





// Inside AddBillsComponent class
bulkEntries: any[] = [];
isProcessing: boolean = false;

// 1. Function to handle Excel Upload
onExcelUpload(event: any) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (e: any) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

    this.prepareBulkEntries(jsonData);
  };
  reader.readAsArrayBuffer(file);
}

prepareBulkEntries(data: any[]) {
  this.bulkEntries = data.map(row => {
    const description = (row['Description'] || '').trim();
    const refNo = row['Ref No./Cheque No.'];
    const debitValue = row['        Debit']; 
    const creditValue = row['Credit'];

    const excelDate = row['Txn Date'];
    const billDate = this.excelDateToJSDate(excelDate);

    // 🔥 USE THE NEW SMARTER MATCHING FUNCTION HERE 🔥
    const matchedSupplier = this.findMatchingSupplier(description);

    const amount = typeof debitValue === 'number' ? debitValue : 0;

    return {
      supplierName: matchedSupplier ? matchedSupplier.supplierName : 'Unknown',
      supplierId: matchedSupplier ? matchedSupplier.supplierId : null,
      billNo: refNo ? refNo.toString().trim() : '0',
      billDate: billDate,
      billAmount: amount,
      dueDate: billDate,
      paymentDate: billDate,
      mode: this.detectMode(description),
      status: 1, 
      comments: description,
      isValid: !!matchedSupplier && amount > 0,
      isSelected: false
    };
  })
  .filter(entry => entry.billAmount > 0); 
  this.autoSelectVisible();
  
  console.log("Processed Bulk Entries:", this.bulkEntries);
}

findMatchingSupplier(description: string): any {
  const upperDesc = description.toUpperCase();
  
  // 1. Words that will cause false positives - DO NOT match based on these alone
  const ignoreWords = ['SINGH', 'KAUR', 'KUMAR', 'THE', 'AND', 'SONS', 'STORE', 'NEW', 'ENT', 'AC'];

  for (let s of this.suppList) {
    if (!s.supplierName) continue;

    // 2. Split the supplier name into individual words (e.g., "Dayal", "Padol", "Mistri")
    const nameParts = s.supplierName.toUpperCase().split(/\s+/);
    
    for (let part of nameParts) {
      // 3. Only check words longer than 2 letters that are NOT in the ignore list
      if (part.length > 2 && !ignoreWords.includes(part)) {
        
        // 4. If the bank description contains this specific word, we found our match!
        if (upperDesc.includes(part)) {
          return s; 
        }
      }
    }
  }
  return null; // Return null if absolutely no words matched
}

// Add this property to track the toggle switch
// 1. The toggle variable
hideUnknowns: boolean = false;

// 2. The getter for the table (as we did before)
get displayedEntries() {
  return this.hideUnknowns 
    ? this.bulkEntries.filter(e => e.isValid) 
    : this.bulkEntries;
}

// 3. The logic to auto-select everything
autoSelectVisible() {
  this.displayedEntries.forEach(entry => {
    // We only auto-select entries that have a valid supplier
    if (entry.isValid) {
      entry.isSelected = true;
    } else {
      entry.isSelected = false; // Keep Unknowns unselected by default
    }
  });
}

// Add this getter function to filter the view dynamically
// get displayedEntries() {
//   if (this.hideUnknowns) {
//     // Only return entries that have a matched supplier (where isValid is true)
//     return this.bulkEntries.filter(entry => entry.isValid);
//   }
//   // If toggle is off, show everything
//   return this.bulkEntries;
// }

// Helper to convert Excel serial date (e.g., 45872.0001) to JS Date
excelDateToJSDate(serial: any) {
  if (typeof serial !== 'number') return new Date();
  const date = new Date(Math.round((serial - 25569) * 86400 * 1000));
  return date;
}

detectMode(desc: string): number {
  if (desc.includes('TRANSFER-UPI')) return 4;
  if (desc.includes('TRANSFER-NEFT')) return 3;
  if (desc.includes('TRANSFER-IMPS')) return 5;
  if (desc.includes('CHEQUE')) return 2;
  return 1; // Default Cash/Online
}

// Helper function to create a delay
private delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async saveBulkEntries() {
  // 1. Only process what is valid and selected
const entriesToSave = this.bulkEntries
  .filter(e => e.isValid && e.isSelected)
  .map(e => ({
    id: 0, // Static value
    supplierName: e.supplierName,
    billNo: e.billNo,
    billDate: e.billDate,
    billAmount: e.billAmount,
    dueDate: e.dueDate,
    billType: 0, // Static value
    status: e.status,
    image: "string", // Static value
    comments: e.comments,
    paymentDate: e.paymentDate,
    mode: e.mode,
    chequeNo: "string", // Static value
    chequeDate: new Date().toISOString(), // Static/Current date
    dateofBankDebit: new Date().toISOString(), // Static/Current date
    neftAmount: 0, // Static value
    neftDate: new Date().toISOString() // Static/Current date
  }));

  if (entriesToSave.length === 0) {
    alert("No valid entries selected!");
    return;
  }

  this.isProcessing = true;
  let actualSavedCount = 0;

  // for (let i = 0; i < entriesToSave.length; i++) {
  //   const entry = entriesToSave[i];

// entriesToSave.filter((m:any) => {

// });

    // const payload = {
    //   ...entry,
    //   billDate: new Date(entry.billDate),
    //   image: "[]",
    //   dateofBankDebit: new Date(),
    //   status: 1 
    // };

    try {
      // 2. Convert the Observable to a Promise and AWAIT it
      // This forces the loop to stop here until the server responds
      await this.srv.PostALL(entriesToSave).toPromise(); 
      
      // actualSavedCount++;
      console.log(`Successfully saved ${entriesToSave.length} entries`);

      // 3. INCREASED DELAY: Wait 1.5 seconds before the next hit
      // This gives your server and database plenty of time to finish the previous task
      // await this.delay(5000); 

    } catch (err) {
      // console.error(`Error at index ${i}:`, err);
      // We still wait even if there's an error to keep the timing consistent
      // await this.delay(5000); 
    }
  // }

  this.isProcessing = false;
  this._snackBar.open(`${actualSavedCount} entries saved successfully`, 'Close', { duration: 5000 });
  
  if (actualSavedCount > 0) {
    this.nav.navigateByUrl('/admin/bills');
  }
}
}
