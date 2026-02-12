import { Injectable } from '@angular/core';
import { BaseService } from './base';
import { SupplierCategory } from '../interfaces/supplier-category';

@Injectable({
  providedIn: 'root',
})
export class SupplierCategoryService {
  constructor(private srv: BaseService) { }

  GetAll() {
    return this.srv.get('SupplierCategory');
  }

  GetById(id: number) {
    return this.srv.get(`SupplierCategory/${id}`);
  }

  Add(model: SupplierCategory) {
    return this.srv.post(model, 'SupplierCategory');
  }

  Update(model: SupplierCategory) {
    return this.srv.put(model, 'SupplierCategory');
  }

  Delete(id: number) {
    return this.srv.delete(`SupplierCategory/${id}`);
  }
}
