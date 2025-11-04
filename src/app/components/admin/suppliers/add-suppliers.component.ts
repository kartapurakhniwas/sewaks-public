import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MasterService } from 'src/app/services';
import { SupplierService } from 'src/app/services/supplier.service';
import { CustomAlertService } from 'src/shared/alert.service';
// import { MasterService } from '../services/master.service';
// import { SupplierService } from '../services/supplier.service';
// import { CustomAlertService } from '../services/custom-alert.service';

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-suppliers.component.html'
})
export class AddSuppliersComponent {
  selectedSupplier: any;
  supplierTypeList: any = [
    { id: 1, name: 'Electricity' },
    { id: 2, name: 'Milk' },
    { id: 3, name: 'Cow Feed' },
    { id: 4, name: 'Construction Material' },
    { id: 5, name: 'Salary' },
    { id: 6, name: 'Hospital Expenses' }
  ];
  itemListFlag: boolean = false;
  supplierList: any = [];

  constructor(
    public gl: MasterService, 
    private supplierService: SupplierService, 
    private nav: Router,
    private customAlertService: CustomAlertService, 
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.GetSupplierList();
  }

  GetSupplierList() {
    let self = this;
    self.supplierService.GetAllByPagination().subscribe((m: any) => {
      if (m.respStatus) {
        this.supplierList = m.lstModel;
        if (this.gl.setRowData) {
          this.GetByID();
        }
      }
    });
  }

  GetByID() {
    let self = this;
    self.supplierService.GetById(this.gl.setRowData.supplierId).subscribe((m: any) => {
      if (m.respStatus) {
        this.setValue(m.lstModel[0]);
      }
    });
  }

  supplierForm = new FormGroup({
    supplierName: new FormControl('', Validators.required),
    supplierType: new FormControl('', Validators.required),
    contactEmail: new FormControl('', [Validators.email]),
    contactPhone: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    notes: new FormControl(''),
    isActive: new FormControl(true, { nonNullable: true }),
    createdOn: new FormControl(new Date())
  } as any);

  setValue(data: any) {
    this.supplierForm.controls["supplierName"].setValue(data?.supplierName);
    this.supplierForm.controls["supplierType"].setValue(data?.supplierType);
    this.supplierForm.controls["contactEmail"].setValue(data?.contactEmail);
    this.supplierForm.controls["contactPhone"].setValue(data?.contactPhone);
    this.supplierForm.controls["address"].setValue(data?.address);
    this.supplierForm.controls["notes"].setValue(data?.notes);
    this.supplierForm.controls["isActive"].setValue(data?.isActive);
    this.supplierForm.controls["createdOn"].setValue(data?.createdOn);
  }

  save() {
    if (this.gl.setRowData) {
      this.update();
    } else {
      this.add();
    }
  }

  add() {
    let self = this;
    let data = this.supplierForm.value;
    data.supplierType = Number(data.supplierType);
    data.createdOn = new Date(data.createdOn);

    if (this.supplierForm.valid) {
      self.supplierService.Add(data).subscribe((m: any) => {
        if (m.respStatus) {
          this.supplierForm.reset();
          this._snackBar.open("Supplier Added Successfully", "Okay", { 'duration': 3000 });
          this.nav.navigateByUrl('/admin/suppliers');
        }
      });
    } else {
      for (let i in this.supplierForm.controls) {
        this.supplierForm.controls[i].markAsTouched();
      }
      this._snackBar.open("Please fill required fields", "Okay", { 'duration': 3000 });
    }
  }

  update() {
    let self = this;
    let data = this.supplierForm.value;
    data.supplierId = this.gl.setRowData.supplierId;
    data.supplierType = Number(data.supplierType);
    data.createdOn = new Date(data.createdOn);

    if (this.supplierForm.valid) {
      self.supplierService.update(data).subscribe((m: any) => {
        if (m.respStatus) {
          this.supplierForm.reset();
          this._snackBar.open("Supplier Updated Successfully", "Okay", { 'duration': 3000 });
          this.nav.navigateByUrl('/admin/suppliers');
        }
      });
    } else {
      for (let i in this.supplierForm.controls) {
        this.supplierForm.controls[i].markAsTouched();
      }
      this._snackBar.open("Please fill required fields", "Okay", { 'duration': 3000 });
    }
  }

  // Optional: If you need search functionality for suppliers
  itemChangeKeyup(event: any) {
    let self = this;
    if (event.target.value == '') {
      this.itemListFlag = false;
    } else {
      this.itemListFlag = true;
      let searchData = {
        "supplierName": event.target.value,
        "pageNumber": 1,
        "pageSize": 10000
      }

      self.supplierService.SearchSuppliers(searchData).subscribe((m: any) => {
        if (m.respStatus) {
          this.supplierList = m.lstModel;
        } else {
          this.supplierList = []
        }
      });
    }
  }

  itemSelected(selected: any) {
    let self = this;
    if (selected) {
      this.itemListFlag = false;
      // If you need to set reference to another supplier
      // this.supplierForm.controls["referredById"].setValue(selected?.supplierId);
      // this.supplierForm.controls["referredBy"].setValue(selected?.supplierName);
    }
  }

  // Reset form
  resetForm() {
    this.supplierForm.reset({
      supplierName: '',
      supplierType: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
      notes: '',
      isActive: true,
      createdOn: new Date()
    });
  }
}
