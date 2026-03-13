import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MasterService } from 'src/app/services';
import { Billservice } from 'src/app/services/bills.service';
import { SupplierService } from 'src/app/services/supplier.service';

declare var bootstrap: any;

@Component({
  selector: 'app-manual-voucher',
  templateUrl: './manual-voucher.component.html',
  styleUrls: ['../style.scss'],
})
export class ManualVoucherComponent implements OnInit {
  @ViewChild('supplierSearchInput') supplierSearchInput?: ElementRef<HTMLInputElement>;

  // Form Group
  voucherForm = new FormGroup({
    supplierName: new FormControl(''),
    newSupplierName: new FormControl(''),
    amount: new FormControl(0, [Validators.required, Validators.min(0.01)]),
    date: new FormControl(new Date().toISOString().substring(0, 10), Validators.required),
    description: new FormControl(''),
    paymentMode: new FormControl(1),
    chequeNo: new FormControl(''),
    chequeDate: new FormControl(''),
    neftNo: new FormControl(''),
    neftDate: new FormControl(''),
    status: new FormControl(1),
    comments: new FormControl('')
  });

  // Dropdown Options
  paymentModes: any[] = [
    { value: 1, viewValue: 'Cash' },
    { value: 2, viewValue: 'Cheque' },
    { value: 3, viewValue: 'NEFT' },
    { value: 4, viewValue: 'UPI' },
    { value: 5, viewValue: 'IMPS' },
    { value: 6, viewValue: 'RTGS' }
  ];

  statusOptions: any[] = [
    { value: 0, viewValue: 'Active' },
    { value: 1, viewValue: 'Paid' },
    { value: 2, viewValue: 'Pending' }
  ];

  // Flags for conditional fields
  showChequeFields: boolean = false;
  showNeftFields: boolean = false;

  // Supplier list
  suppliers: any[] = [];
  filteredSuppliers: any[] = [];
  
  // Recent vouchers
  recentVouchers: any[] = [];
  
  // Generated voucher number
  voucherNumber: string = '';

  constructor(
    private supplierService: SupplierService,
    private billService: Billservice,
    private masterService: MasterService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
    this.generateVoucherNumber();
    this.loadRecentVouchers();
    
    // Set default date
    this.setToday();
  }

  // Load suppliers from API
  loadSuppliers(): void {
    this.supplierService.GetAllByPagination().subscribe((response: any) => {
      if (response.respStatus) {
        this.suppliers = response.lstModel;
        this.filteredSuppliers = [...this.suppliers];
      }
    });
  }

  // Generate unique voucher number
  generateVoucherNumber(): void {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    this.voucherNumber = `VCH-${year}${month}${day}-${random}`;
  }

  // Load recent vouchers
  loadRecentVouchers(): void {
    this.billService.GetAllByPagination().subscribe((response: any) => {
      if (response.respStatus) {
        this.recentVouchers = response.lstModel.slice(0, 10); // Last 10 vouchers
      }
    });
  }

  // Filter suppliers based on search input
  filterSuppliers(event: any): void {
    const searchTerm = event.target.value.trim().toLowerCase();
    
    if (!searchTerm) {
      this.filteredSuppliers = [...this.suppliers];
      return;
    }
    
    this.filteredSuppliers = this.suppliers.filter(supplier => 
      supplier.supplierName.toLowerCase().includes(searchTerm)
    );
  }

  // Handle supplier selection
  onSupplierSelected(supplierName: string): void {
    const selected = this.suppliers.find(s => s.supplierName === supplierName);
    if (selected) {
      this.voucherForm.patchValue({
        supplierName: selected.supplierName,
        newSupplierName: '' // Clear new supplier field
      });
    }
  }

  // Handle supplier dropdown open
  onSupplierOpened(opened: boolean): void {
    if (opened) {
      this.filteredSuppliers = [...this.suppliers];
      setTimeout(() => {
        if (this.supplierSearchInput) {
          this.supplierSearchInput.nativeElement.value = '';
          this.supplierSearchInput.nativeElement.focus();
        }
      }, 0);
    }
  }

  // Handle payment mode change
  onPaymentModeChange(event: any): void {
    const mode = event.value;
    this.showChequeFields = mode === 2; // Cheque
    this.showNeftFields = [3, 4, 5, 6].includes(mode); // NEFT, UPI, IMPS, RTGS
    
    // Clear conditional fields when not applicable
    if (!this.showChequeFields) {
      this.voucherForm.patchValue({ chequeNo: '', chequeDate: '' });
    }
    if (!this.showNeftFields) {
      this.voucherForm.patchValue({ neftNo: '', neftDate: '' });
    }
  }

  // Get supplier display name (prioritize new supplier if entered)
  getSupplierDisplayName(): string {
    const newSupplier = this.voucherForm.get('newSupplierName')?.value;
    const selectedSupplier = this.voucherForm.get('supplierName')?.value;
    
    return newSupplier || selectedSupplier || 'Not specified';
  }

  // Get payment mode text
  getPaymentModeText(): string {
    const modeValue = this.voucherForm.get('paymentMode')?.value;
    const mode = this.paymentModes.find(m => m.value === modeValue);
    return mode ? mode.viewValue : 'Cash';
  }

  // Get status text
  getStatusText(statusValue: number): string {
    const status = this.statusOptions.find(s => s.value === statusValue);
    return status ? status.viewValue : 'Unknown';
  }

// Convert amount to words with safe handling
amountInWords(amount: number | null | undefined): string {
  if (!amount || amount <= 0) return 'Zero';
  
  const num = Math.floor(amount); // Ensure we're working with whole numbers
  
  const words = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen', 'Twenty', 'Twenty One', 'Twenty Two',
    'Twenty Three', 'Twenty Four', 'Twenty Five', 'Twenty Six', 'Twenty Seven',
    'Twenty Eight', 'Twenty Nine', 'Thirty', 'Thirty One', 'Thirty Two',
    'Thirty Three', 'Thirty Four', 'Thirty Five', 'Thirty Six', 'Thirty Seven',
    'Thirty Eight', 'Thirty Nine', 'Forty', 'Forty One', 'Forty Two',
    'Forty Three', 'Forty Four', 'Forty Five', 'Forty Six', 'Forty Seven',
    'Forty Eight', 'Forty Nine', 'Fifty', 'Fifty One', 'Fifty Two',
    'Fifty Three', 'Fifty Four', 'Fifty Five', 'Fifty Six', 'Fifty Seven',
    'Fifty Eight', 'Fifty Nine', 'Sixty', 'Sixty One', 'Sixty Two',
    'Sixty Three', 'Sixty Four', 'Sixty Five', 'Sixty Six', 'Sixty Seven',
    'Sixty Eight', 'Sixty Nine', 'Seventy', 'Seventy One', 'Seventy Two',
    'Seventy Three', 'Seventy Four', 'Seventy Five', 'Seventy Six',
    'Seventy Seven', 'Seventy Eight', 'Seventy Nine', 'Eighty', 'Eighty One',
    'Eighty Two', 'Eighty Three', 'Eighty Four', 'Eighty Five', 'Eighty Six',
    'Eighty Seven', 'Eighty Eight', 'Eighty Nine', 'Ninety', 'Ninety One',
    'Ninety Two', 'Ninety Three', 'Ninety Four', 'Ninety Five', 'Ninety Six',
    'Ninety Seven', 'Ninety Eight', 'Ninety Nine'
  ];
  
  if (num < 20) return words[num];
  if (num < 100) {
    const tens = Math.floor(num / 10) * 10;
    const ones = num % 10;
    return this.getTensWord(tens) + (ones ? ' ' + words[ones] : '');
  }
  if (num < 1000) {
    const hundreds = Math.floor(num / 100);
    const remainder = num % 100;
    return words[hundreds] + ' Hundred' + (remainder ? ' ' + this.amountInWords(remainder) : '');
  }
  if (num < 100000) {
    const thousands = Math.floor(num / 1000);
    const remainder = num % 1000;
    return this.amountInWords(thousands) + ' Thousand' + (remainder ? ' ' + this.amountInWords(remainder) : '');
  }
  if (num < 10000000) {
    const lakhs = Math.floor(num / 100000);
    const remainder = num % 100000;
    return this.amountInWords(lakhs) + ' Lakh' + (remainder ? ' ' + this.amountInWords(remainder) : '');
  }
  
  return 'Number too large';
}

// Helper function for tens words
private getTensWord(tens: number): string {
  const tensWords: { [key: number]: string } = {
    20: 'Twenty', 30: 'Thirty', 40: 'Forty', 50: 'Fifty',
    60: 'Sixty', 70: 'Seventy', 80: 'Eighty', 90: 'Ninety'
  };
  return tensWords[tens] || '';
}

  // Set today's date
  setToday(): void {
    const today = new Date().toISOString().substring(0, 10);
    this.voucherForm.patchValue({ date: today });
  }

  // Clear form
  clearForm(): void {
    this.voucherForm.reset({
      paymentMode: 1,
      status: 1,
      date: new Date().toISOString().substring(0, 10)
    });
    this.showChequeFields = false;
    this.showNeftFields = false;
    this.generateVoucherNumber();
  }

  // Use last entered amount
  useLastAmount(): void {
    if (this.recentVouchers.length > 0) {
      const lastAmount = this.recentVouchers[0].billAmount;
      this.voucherForm.patchValue({ amount: lastAmount });
      this.snackBar.open(`Last amount: ₹${lastAmount}`, 'Close', { duration: 3000 });
    }
  }

  // Load voucher for editing
  loadVoucher(voucher: any): void {
    this.voucherForm.patchValue({
      supplierName: voucher.supplierName,
      amount: voucher.billAmount,
      date: voucher.billDate,
      description: voucher.comments,
      paymentMode: voucher.mode || 1,
      status: voucher.status,
      comments: voucher.comments
    });
    
    // Handle payment mode specific fields
    if (voucher.mode === 2) {
      this.showChequeFields = true;
      this.voucherForm.patchValue({
        chequeNo: voucher.chequeNo,
        chequeDate: voucher.chequeDate
      });
    } else if ([3, 4, 5, 6].includes(voucher.mode)) {
      this.showNeftFields = true;
      this.voucherForm.patchValue({
        neftNo: voucher.neftNo || voucher.chequeNo,
        neftDate: voucher.neftDate || voucher.chequeDate
      });
    }
    
    this.snackBar.open('Voucher loaded', 'Close', { duration: 3000 });
  }

  // Validate form before saving
  validateForm(): boolean {
    const supplierName = this.voucherForm.get('supplierName')?.value;
    const newSupplier = this.voucherForm.get('newSupplierName')?.value;
    const amount:any = this.voucherForm.get('amount')?.value;
    
    if (!supplierName && !newSupplier) {
      this.snackBar.open('Please select or enter a supplier name', 'Close', { duration: 3000 });
      return false;
    }
    
    if (!amount || amount <= 0) {
      this.snackBar.open('Please enter a valid amount', 'Close', { duration: 3000 });
      return false;
    }
    
    return true;
  }

  // Prepare data for API
  prepareVoucherData(): any {
    const formValue = this.voucherForm.value;
    const supplierName = formValue.newSupplierName || formValue.supplierName;
    
    return {
      id: 0,
      supplierName: supplierName,
      billNo: this.voucherNumber,
      billDate: new Date(formValue.date || new Date()),
      billAmount: Number(formValue.amount),
      dueDate: new Date(formValue.date || new Date()),
      paymentDate: new Date(formValue.date || new Date()),
      billType: 0,
      status: Number(formValue.status),
      mode: Number(formValue.paymentMode),
      comments: formValue.comments || formValue.description || '',
      chequeNo: formValue.chequeNo || '',
      chequeDate: formValue.chequeDate ? new Date(formValue.chequeDate) : new Date(),
      neftAmount: [3, 4, 5, 6].includes(Number(formValue.paymentMode)) ? Number(formValue.amount) : 0,
      neftDate: formValue.neftDate ? new Date(formValue.neftDate) : new Date(),
      dateofBankDebit: new Date(),
      image: '[]'
    };
  }

  // Save voucher
  saveVoucher(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.validateForm()) {
        reject('Validation failed');
        return;
      }
      
      const data = this.prepareVoucherData();
      
      this.billService.Add(data).subscribe({
        next: (response: any) => {
          if (response.respStatus) {
            this.snackBar.open('Voucher saved successfully', 'Close', { duration: 3000 });
            this.generateVoucherNumber();
            this.loadRecentVouchers();
            resolve(response);
          } else {
            this.snackBar.open('Error saving voucher', 'Close', { duration: 3000 });
            reject(response);
          }
        },
        error: (error) => {
          console.error('Error saving voucher:', error);
          this.snackBar.open('Error saving voucher', 'Close', { duration: 3000 });
          reject(error);
        }
      });
    });
  }

  // Print voucher (show preview)
  printVoucher(): void {
    if (!this.validateForm()) return;
    
    const modalElement = document.getElementById('printPreviewModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  // Save and print
  async saveAndPrint(): Promise<void> {
    try {
      await this.saveVoucher();
      this.printVoucher();
    } catch (error) {
      console.error('Error in save and print:', error);
    }
  }

  // Print existing voucher
  printExistingVoucher(voucher: any): void {
    this.loadVoucher(voucher);
    setTimeout(() => {
      this.printVoucher();
    }, 100);
  }
}