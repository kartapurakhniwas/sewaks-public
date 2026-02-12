import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SupplierCategory } from 'src/app/interfaces/supplier-category';
import { MasterService } from 'src/app/services';
import { SupplierCategoryService } from 'src/app/services/supplier-category.service';

@Component({
  selector: 'app-add-supplier-category',
  templateUrl: './add-supplier-category.component.html',
  styleUrls: ['../style.scss']
})
export class AddSupplierCategoryComponent implements OnInit {
  updateFlag = false;

  constructor(
    public gl: MasterService,
    private supplierCategoryService: SupplierCategoryService,
    private nav: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    if (this.gl.setRowData) {
      this.updateFlag = true;
      this.setValue(this.gl.setRowData);
    }
  }

  categoryForm = new FormGroup({
    categoryName: new FormControl('', Validators.required),
    description: new FormControl('')
  } as any);

  setValue(data: any) {
    this.categoryForm.controls['categoryName'].setValue(data?.categoryName);
    this.categoryForm.controls['description'].setValue(data?.description);
  }

  save() {
    if (this.updateFlag) {
      this.update();
    } else {
      this.add();
    }
  }

  add() {
    const data = this.categoryForm.value as SupplierCategory;
    data.categoryName = data.categoryName?.trim();

    if (this.categoryForm.valid && data.categoryName) {
      this.supplierCategoryService.Add(data).subscribe((m: any) => {
        if (m?.respStatus === false) {
          return;
        }
        this.categoryForm.reset();
        this.gl.setRowData = null;
        this.snackBar.open('Supplier category added successfully', 'Okay', { duration: 3000 });
        this.nav.navigateByUrl('/admin/supplier-category');
      });
    } else {
      this.categoryForm.markAllAsTouched();
      this.snackBar.open('Please fill required fields', 'Okay', { duration: 3000 });
    }
  }

  update() {
    const data = this.categoryForm.value as SupplierCategory;
    data.categoryName = data.categoryName?.trim();
    data.supplierCategoryId = this.gl.setRowData?.supplierCategoryId || this.gl.setRowData?.id;

    if (this.categoryForm.valid && data.categoryName && data.supplierCategoryId) {
      this.supplierCategoryService.Update(data).subscribe((m: any) => {
        if (m?.respStatus === false) {
          return;
        }
        this.categoryForm.reset();
        this.gl.setRowData = null;
        this.snackBar.open('Supplier category updated successfully', 'Okay', { duration: 3000 });
        this.nav.navigateByUrl('/admin/supplier-category');
      });
    } else {
      this.categoryForm.markAllAsTouched();
      this.snackBar.open('Please fill required fields', 'Okay', { duration: 3000 });
    }
  }
}
