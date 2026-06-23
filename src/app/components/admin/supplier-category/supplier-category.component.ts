import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community';
import { MasterService } from 'src/app/services';
import { SupplierCategoryService } from 'src/app/services/supplier-category.service';
import { TableUtil } from 'src/shared/tableUtil';
import { SupplierCategory } from 'src/app/interfaces/supplier-category';

@Component({
  selector: 'app-supplier-category',
  templateUrl: './supplier-category.component.html',
  styleUrls: ['../style.scss']
})
export class SupplierCategoryComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular | undefined;

  public gridApi: any;
  public gidColumnApi: any;
  public columnDefs: any;
  public sortingOrder: any;
  defaultColDef: any;
  gridOptions: GridOptions;
  rowSelection: string;
  statusValue: any;
  isfilter: any;
  getpaged: SupplierCategory[] = [];

  constructor(
    public gl: MasterService,
    private supplierCategoryService: SupplierCategoryService,
    public datepipe: DatePipe
  ) {
    this.columnDefs = [
      {
        headerName: 'Category Name',
        field: 'categoryName',
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        sortingOrder: ['asc', 'desc'],
        width: 250,
      },
      {
        headerName: 'Description',
        field: 'description',
        width: 400,
        valueGetter: (params: any) => params.data?.description || '-'
      }
    ];

    this.defaultColDef = {
      editable: false,
      resizable: true,
      sortable: true,
      filter: true
    };

    this.gridOptions = {
      defaultColDef: {
        sortable: true,
      }
    };

    this.rowSelection = 'single';
    this.gl.setRowData = null;
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.supplierCategoryService.GetAll().subscribe((m: any) => {
      if (m?.respStatus) {
        this.getpaged = m.lstModel;
      } else if (Array.isArray(m)) {
        this.getpaged = m;
      } else {
        this.getpaged = [];
      }
    });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gidColumnApi = params.columnApi;
    params.api.setRowData(this.getpaged);
  }

  clearFilter() {
    this.gridApi?.setFilterModel(null);
  }

  onSelectionChanged() {
    this.gl.setRowData = null;
    const selectedNodes = this.agGrid?.api.getSelectedNodes();
    const selectedData: any = selectedNodes?.map((node) => node.data);
    this.gl.setRowData = JSON.stringify(selectedData && selectedData[0])
      ? selectedData[0]
      : null;
  }

  delete() {
    const selected = this.gl.setRowData;
    const id = selected?.supplierCategoryId || selected?.id;
    if (!id) {
      return;
    }
    if (confirm('Are you sure you want to Delete?')) {
      this.supplierCategoryService.Delete(id).subscribe((m: any) => {
        if (m?.respStatus === false) {
          return;
        }
        this.refresh();
        this.gl.setRowData = null;
      });
    }
  }

  exportAsExcel() {
    if (!this.getpaged?.length) {
      return;
    }
    const data = this.getpaged.map(item => ({
      'Category Name': item.categoryName,
      Description: item.description || ''
    }));
    TableUtil.exportAgGridToExcel(data, 'SupplierCategory');
  }
}
