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
  @ViewChild('supplierSearchInput')
  supplierSearchInput?: ElementRef<HTMLInputElement>;
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


  // findMatchingSupplier(description: string): any {
  //   const upperDesc = description.toUpperCase();

  //   // 1. Words that will cause false positives - DO NOT match based on these alone
  //   const ignoreWords = ['SINGH', 'KAUR', 'KUMAR', 'THE', 'AND', 'SONS', 'STORE', 'NEW', 'ENT', 'AC'];

  //   let list = [...this.suppList, { supplierName: 'Gurm' }];

  //   for (let s of list) {
  //     if (!s.supplierName) continue;

  //     // 2. Split the supplier name into individual words (e.g., "Dayal", "Padol", "Mistri")
  //     const nameParts = s.supplierName.toUpperCase().split(/\s+/);

  //     for (let part of nameParts) {
  //       // 3. Only check words longer than 2 letters that are NOT in the ignore list
  //       if (part.length > 2 && !ignoreWords.includes(part)) {

  //         // 4. If the bank description contains this specific word, we found our match!
  //         if (upperDesc.includes(part)) {
  //           return s;
  //         }
  //       }
  //     }
  //   }
  //   return null; // Return null if absolutely no words matched
  // }

  // findMatchingSupplier(description: string): any {
  //   if (!description) return null;
  //   const upperDesc = description.toUpperCase();

  //   // 1. HARDCODED MAPPING: For cases where words don't match at all
  //   // Key: The text found in Excel | Value: The supplier name in your system
  //   const manualMap: { [key: string]: string } = {
  //     'NEW SANTHYA': 'Jaspal Singh (Gurmukhi Teacher)',
  //     'SANTHYA': 'Jaspal Singh (Gurmukhi Teacher)',
  //     // You can add more aliases here in the future
  //   };

  //   // Check if the description contains any of our manual mapping keys
  //   for (const [key, targetName] of Object.entries(manualMap)) {
  //     if (upperDesc.includes(key)) {
  //       const match = this.suppList.find(s => s.supplierName === targetName);
  //       if (match) return match;
  //     }
  //   }

  //   // 2. Words that will cause false positives - DO NOT match based on these alone
  //   const ignoreWords = ['SINGH', 'KAUR', 'KUMAR', 'THE', 'AND', 'SONS', 'STORE', 'NEW', 'ENT', 'AC'];

  //   // 3. Regular Matching Logic (Fallback)
  //   for (let s of this.suppList) {
  //     if (!s.supplierName) continue;

  //     const nameParts = s.supplierName.toUpperCase().split(/\s+/);

  //     for (let part of nameParts) {
  //       // Only check words longer than 2 letters that are NOT in the ignore list
  //       if (part.length > 2 && !ignoreWords.includes(part)) {
  //         if (upperDesc.includes(part)) {
  //           return s;
  //         }
  //       }
  //     }
  //   }

  //   return null;
  // }


  // Add this property to track the toggle switch
  // 1. The toggle variable
  hideUnknowns: boolean = false;


  // 3. The logic to auto-select everything
  autoSelectVisible() {
    this.displayedEntries.forEach((entry) => {
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
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

async saveBulkEntries() {
  // Use filteredBySupplierEntries to only save from current filtered view
  // and filter only selected ones
  const entriesToSave = this.filteredBySupplierEntries
    .filter((e) => e.isValid && e.isSelected)
    .map((e) => ({
      id: 0, // Static value
      supplierName: e.supplierName,
      billNo: e.billNo,
      billDate: e.billDate,
      billAmount: e.billAmount,
      dueDate: e.dueDate,
      billType: 0, // Static value
      status: e.status,
      image: 'string', // Static value
      comments: e.comments,
      paymentDate: e.paymentDate,
      mode: e.mode,
      chequeNo: 'string', // Static value
      chequeDate: new Date().toISOString(), // Static/Current date
      dateofBankDebit: new Date().toISOString(), // Static/Current date
      neftAmount: 0, // Static value
      neftDate: new Date().toISOString(), // Static/Current date
    }));

  if (entriesToSave.length === 0) {
    this._snackBar.open('No entries selected! Please select entries to save.', 'Close', { duration: 3000 });
    return;
  }

  this.isProcessing = true;

  try {
    // Save all selected entries
    await this.srv.PostALL(entriesToSave).toPromise();
    
    this._snackBar.open(
      `${entriesToSave.length} entries saved successfully`,
      'Close',
      { duration: 5000 },
    );

    // Remove saved entries from bulkEntries or refresh the list
    // Option 1: Remove saved entries
    const savedSupplierNames = entriesToSave.map(e => e.supplierName);
    this.bulkEntries = this.bulkEntries.filter(e => 
      !(e.isSelected && savedSupplierNames.includes(e.supplierName))
    );
    
    // Option 2: Clear all selections
    this.bulkEntries.forEach(e => e.isSelected = false);
    
  } catch (err) {
    console.error('Error saving entries:', err);
    this._snackBar.open('Error saving entries. Please try again.', 'Close', { duration: 5000 });
  } finally {
    this.isProcessing = false;
  }
}


buildSupplierProfiles() {
  const profiles = [];
  
  for (let s of this.suppList) {
    if (!s.supplierName) continue;
    
    // Get base name without parentheses
    const baseName = s.supplierName.split('(')[0].trim();
    const upperName = baseName.toUpperCase();
    const nameWords = upperName.split(/\s+/).filter((w:any) => w.length > 2);
    
    // Calculate word frequencies across all suppliers to identify unique vs common words
    const wordUniqueness = this.calculateWordUniqueness(nameWords);
    
    // Create supplier profile
    const profile = {
      supplier: s,
      originalName: baseName,
      words: nameWords,
      // Identify which words are unique to this supplier
      uniqueWords: nameWords.filter((w:any) => wordUniqueness[w] === 1),
      // Words that appear in multiple suppliers
      commonWords: nameWords.filter((w:any) => wordUniqueness[w] > 1),
      // Full name patterns (including combinations)
      patterns: this.generateNamePatterns(upperName)
    };
    
    profiles.push(profile);
  }
  
  return profiles;
}

calculateWordUniqueness(supplierWords: string[]) {
  // First, count how many suppliers have each word
  const wordCount: { [key: string]: number } = {};
  
  for (let s of this.suppList) {
    if (!s.supplierName) continue;
    
    const baseName = s.supplierName.split('(')[0].trim().toUpperCase();
    const words:any = [...new Set(baseName.split(/\s+/))]; // Use Set to count each word once per supplier
    
    for (let word of words) {
      if (word.length > 2) {
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    }
  }
  
  return wordCount;
}

generateNamePatterns(fullName: string): string[] {
  const patterns = [];
  const words = fullName.split(/\s+/);
  
  // Add full name
  patterns.push(fullName);
  
  // Add name without spaces
  patterns.push(fullName.replace(/\s+/g, ''));
  
  // Add first two words combination (important for names like "Roda Ram")
  if (words.length >= 2) {
    patterns.push(words.slice(0, 2).join(' '));
    patterns.push(words.slice(0, 2).join(''));
  }
  
  // Add first and last word combination
  if (words.length > 2) {
    patterns.push(words[0] + ' ' + words[words.length - 1]);
    patterns.push(words[0] + words[words.length - 1]);
  }
  
  return patterns;
}

extractPatterns(description: string) {
  const patterns = [];
  const words = description.split(/\s+/).filter(w => w.length > 2);
  
  // Individual words
  patterns.push(...words);
  
  // Word pairs (important for detecting full names)
  for (let i = 0; i < words.length - 1; i++) {
    patterns.push(words[i] + ' ' + words[i + 1]);
    patterns.push(words[i] + words[i + 1]);
  }
  
  // Word triplets for longer names
  for (let i = 0; i < words.length - 2; i++) {
    patterns.push(words[i] + ' ' + words[i + 1] + ' ' + words[i + 2]);
    patterns.push(words[i] + words[i + 1] + words[i + 2]);
  }
  
  // Remove duplicates
  return [...new Set(patterns)];
}

findBestContextualMatch(descPatterns: string[], supplierProfiles: any[]) {
  let bestMatch = null;
  let highestScore = 0;
  const threshold = 0.4; // Lower threshold since we have better context
  
  for (let profile of supplierProfiles) {
    let score = 0;
    let totalChecks = 0;
    
    // 1. Check for unique word matches (highest weight)
    for (let uniqueWord of profile.uniqueWords) {
      totalChecks += 3; // Triple weight for unique words
      
      // Check various forms of the word
      if (descPatterns.some(p => p === uniqueWord || p.includes(uniqueWord))) {
        score += 3;
      } else {
        // Check if word appears as part of longer text
        const descStr = descPatterns.join(' ');
        if (descStr.includes(uniqueWord)) {
          score += 2; // Partial match gets partial points
        }
      }
    }
    
    // 2. Check for exact name pattern matches (very strong indicator)
    for (let pattern of profile.patterns) {
      totalChecks += 2;
      if (descPatterns.includes(pattern)) {
        score += 4; // Big bonus for exact name match
        break; // Only count once
      }
    }
    
    // 3. Check for word combinations (context)
    const profileWords = profile.words;
    if (profileWords.length >= 2) {
      totalChecks += 2;
      
      // Count how many words from this supplier appear in description
      const wordsFound = profileWords.filter((w:any) => 
        descPatterns.some((p:any) => p === w || p.includes(w))
      ).length;
      
      // If we find multiple words from same supplier, it's a strong match
      if (wordsFound >= 2) {
        score += 3;
      }
    }
    
    // 4. Negative check - if description contains unique words from other suppliers
    for (let otherProfile of supplierProfiles) {
      if (otherProfile.supplier.supplierName === profile.supplier.supplierName) continue;
      
      for (let otherUniqueWord of otherProfile.uniqueWords) {
        if (descPatterns.some(p => p.includes(otherUniqueWord))) {
          // Found a unique word from another supplier - this is bad
          totalChecks += 1;
          score -= 2; // Heavy penalty
        }
      }
    }
    
    // Calculate final score
    const finalScore = totalChecks > 0 ? score / totalChecks : 0;
    
    // Normalize to 0-1 range and apply threshold
    const normalizedScore = Math.max(0, Math.min(1, finalScore));
    
    if (normalizedScore > highestScore && normalizedScore >= threshold) {
      highestScore = normalizedScore;
      bestMatch = profile.supplier;
    }
  }
  
  return bestMatch;
}








// Add these properties
showAllEntries: boolean = false;
toggleUnmatchedList: boolean = true; // Controls visibility of unmatched list

// Computed property for unmatched "To Transfer" entries
get unmatchedToTransferEntries() {
  return this.bulkEntries.filter(entry => 
    !entry.isValid && // Not matched
    entry.transferType === 'TO' && // Is "To Transfer" type
    entry.originalDescription // Has description
  );
}

// Helper method to determine transfer type
getTransferType(description: string): string {
  if (!description) return 'OTHER';
  
  const upperDesc = description.toUpperCase();
  
  if (upperDesc.includes('TO TRANSFER') || 
      upperDesc.startsWith('TO-') || 
      upperDesc.includes(' TO ') ||
      upperDesc.includes('TRANSFER-TO') ||
      upperDesc.includes('TO/')) {
    return 'TO';
  }
  
  if (upperDesc.includes('BY TRANSFER') || 
      upperDesc.startsWith('BY-') || 
      upperDesc.includes(' BY ') ||
      upperDesc.includes('TRANSFER-BY')) {
    return 'BY';
  }
  
  return 'OTHER';
}

// Helper method to get total amount of unmatched entries
getUnmatchedTotalAmount(): number {
  return this.unmatchedToTransferEntries.reduce((sum, entry) => sum + entry.billAmount, 0);
}

// Helper method to get unique keywords from unmatched entries
getUniqueKeywordsFromUnmatched(): string {
  const allKeywords = this.unmatchedToTransferEntries
    .flatMap(entry => entry.extractedWords || [])
    .filter((word, index, self) => self.indexOf(word) === index); // Get unique
  
  return allKeywords.join(', ') || 'None';
}



// Override the displayedEntries getter to include the new filter
get displayedEntries() {
  if (this.showAllEntries) {
    return this.bulkEntries; // Show all for testing
  }
  // Show only valid entries (those with matches) AND not in unmatched list
  return this.bulkEntries.filter((e) => e.isValid);
}

// Update the stats methods to exclude unmatched entries from main view if needed
getValidMatchesCount(): number {
  return this.bulkEntries.filter(e => e.isValid).length;
}

getNoMatchesCount(): number {
  return this.bulkEntries.filter(e => !e.isValid).length;
}

getSelectedCount(): number {
  return this.bulkEntries.filter(e => e.isSelected).length;
}








// Add this method
onShowAllToggle() {
  // When toggling test mode, we might want to reset selections or just refresh view
  console.log('Show all entries:', this.showAllEntries);
}

// Add this helper method to extract key words from description
extractKeyWords(description: string): string[] {
  if (!description) return [];
  
  // Common words to ignore
  const ignoreWords = [
    'SINGH', 'KAUR', 'THE', 'AND', 'FOR', 'FROM', 'TO', 
    'NEFT', 'IMPS', 'UPI', 'RTGS', 'TRANSFER', 'UTR', 'REF',
    'UTRIB', 'SBIN', 'HDFC', 'ICICI', 'BANK', 'NO', 'MOB', 
    'BAL', 'AVAILABLE', 'OTHERS', 'BY', 'TO', 'INB', 'OUTB',
    'PAYMENT', 'RECEIVED', 'CHARGES', 'COMMISSION', 'TAX',
    'ONLINE', 'MOBILE', 'BANKING', 'CREDIT', 'DEBIT',
    'PENDING', 'CLEARED', 'RETURNED', 'REVERSAL'
  ];
  
  const words = description.toUpperCase()
    .split(/[\s\-/]+/) // Split by spaces, hyphens, slashes
    .map(w => w.replace(/[^A-Z]/g, '')) // Remove special characters
    .filter(w => w.length > 2) // Only words longer than 2 chars
    .filter(w => !ignoreWords.includes(w)); // Remove common words
  
  return [...new Set(words)]; // Remove duplicates
}

// Add this helper to extract potential supplier name
extractPotentialSupplierName(description: string): string {
  if (!description) return '';
  
  // Remove transaction identifiers and numbers
  let cleaned = description
    .replace(/TO TRANSFER|BY TRANSFER|NEFT|IMPS|UPI|RTGS|TRANSFER|UTR|REF|NO|MOB|BAL|AVAILABLE|OTHERS?/gi, '')
    .replace(/[0-9\-/]+/g, ' ') // Replace numbers with space
    .replace(/\s+/g, ' ')
    .trim();
  
  // Split into words and filter out short/common words
  const words = cleaned.split(/\s+/)
    .filter(word => word.length > 2)
    .filter(word => !['SINGH', 'KAUR', 'THE', 'AND', 'FOR', 'FROM', 'TO', 'BANK'].includes(word.toUpperCase()));
  
  // Return last 2-3 words (usually the name)
  if (words.length >= 3) {
    return words.slice(-3).join(' ');
  } else if (words.length >= 2) {
    return words.slice(-2).join(' ');
  } else {
    return words[0] || description;
  }
}

// Add this method to create supplier from entry
createSupplierFromEntry(entry: any) {
  const potentialName = this.extractPotentialSupplierName(entry.originalDescription);
  
  const confirmMessage = `Create new supplier with name "${potentialName}"?\n\nThis will redirect you to the Add Supplier page.`;
  
  if (confirm(confirmMessage)) {
    // Store the potential name in session storage to pre-fill in add supplier page
    sessionStorage.setItem('suggestedSupplierName', potentialName);
    // Navigate to add supplier page
    this.nav.navigateByUrl('/admin/add-supplier');
  }
}

// Add this method to manually match entry
manuallyMatchEntry(entry: any) {
  // You can implement a modal or prompt for manual matching
  // For now, let's create a simple prompt to enter supplier name
  const supplierName = prompt('Enter supplier name for this transaction:', entry.extractedWords?.join(' ') || '');
  
  if (supplierName) {
    // Find the supplier in the list
    const matchedSupplier = this.suppList.find(s => 
      s.supplierName.toUpperCase().includes(supplierName.toUpperCase())
    );
    
    if (matchedSupplier) {
      // Update the entry
      entry.supplierName = matchedSupplier.supplierName;
      entry.supplierId = matchedSupplier.supplierId;
      entry.isValid = true;
      entry.isSelected = true;
      
      this._snackBar.open(`Manually matched to ${matchedSupplier.supplierName}`, 'Close', { duration: 3000 });
    } else {
      const createNew = confirm(`Supplier "${supplierName}" not found. Would you like to create it?`);
      if (createNew) {
        sessionStorage.setItem('suggestedSupplierName', supplierName);
        this.nav.navigateByUrl('/admin/add-supplier');
      }
    }
  }
}



















// Helper to check if two words are similar (handles minor typos/missing letters)
isSimilarWord(word1: string, word2: string): boolean {
  const w1 = word1.toUpperCase();
  const w2 = word2.toUpperCase();
  
  // Exact match
  if (w1 === w2) return true;
  
  // One is substring of the other
  if (w1.includes(w2) || w2.includes(w1)) return true;
  
  // Check for missing last character (common in bank statements)
  if (Math.abs(w1.length - w2.length) === 1) {
    if (w1.startsWith(w2) || w2.startsWith(w1)) return true;
  }
  
  // Check for common first 3 characters matching
  if (w1.length >= 3 && w2.length >= 3) {
    if (w1.substring(0, 3) === w2.substring(0, 3)) return true;
  }
  
  return false;
}

// Helper to check if a word is unique to this supplier
isWordUnique(word: string, supplierName: string): boolean {
  let count = 0;
  for (let s of this.suppList) {
    if (s.supplierName && s.supplierName.toUpperCase().includes(word)) {
      count++;
      if (count > 1) return false;
    }
  }
  return true;
}


// Update your existing prepareBulkEntries method to use the new matching
prepareBulkEntries(data: any[]) {
  this.bulkEntries = data
    .map((row) => {
      const description = (row['Description'] || '').trim();
      const refNo = row['Ref No./Cheque No.'];
      const debitValue = row['        Debit'];
      const creditValue = row['Credit'];

      const excelDate = row['Txn Date'];
      const billDate = this.excelDateToJSDate(excelDate);

      // Determine if it's "To Transfer" or "By Transfer"
      const transferType = this.getTransferType(description);
      
      // Get matched supplier with more details
      const matchResult = this.findMatchingSupplierWithDetails(description);
      
      const amount = typeof debitValue === 'number' ? debitValue : 0;

      return {
        supplierName: matchResult.supplier ? matchResult.supplier.supplierName : 'Unknown',
        supplierId: matchResult.supplier ? matchResult.supplier.supplierId : null,
        billNo: refNo ? refNo.toString().trim() : '0',
        billDate: billDate,
        billAmount: amount,
        dueDate: billDate,
        paymentDate: billDate,
        mode: 3,
        status: 1,
        comments: description,
        originalDescription: description,
        refNo: refNo,
        transferType: transferType,
        isValid: !!matchResult.supplier && amount > 0,
        isSelected: false,
        matchScore: matchResult.score || 0,
        matchedWords: matchResult.matchedWords || [],
        extractedWords: this.extractKeyWords(description)
      };
    })
    .filter((entry) => entry.billAmount > 0);
  
  this.autoSelectVisible();
  
  // Log summary
  const unmatchedToTransfer = this.unmatchedToTransferEntries;
  if (unmatchedToTransfer.length > 0) {
    console.warn(`Found ${unmatchedToTransfer.length} unmatched "To Transfer" entries:`, unmatchedToTransfer);
  }
  
  console.log('Processed Bulk Entries:', this.bulkEntries);
}







findMatchingSupplier(description: string): any {
  if (!description) return null;
  
  const upperDesc = description.toUpperCase()
    .replace(/[^A-Z\s]/g, ' ') // Remove special chars
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
  
  // ============== STEP 1: MANUAL MAPPING FOR KNOWN ISSUES ==============
  const manualMap: { [key: string]: string } = {
    // Existing mappings
    'NEW SANTHYA': 'Jaspal Singh (Gurmukhi Teacher)',
    'SANTHYA': 'Jaspal Singh (Gurmukhi Teacher)',
    
    // Rajit Ram cases
    'RAJIT RAM': 'Rajit Ram (Driver & Langar Sewa)',
    'RAJITRAM': 'Rajit Ram (Driver & Langar Sewa)',
    'RAJIT RAM WIFE': 'Rajit Ram Wife (Langar Sewa)',
    'RAJITRAM WIFE': 'Rajit Ram Wife (Langar Sewa)',
    'RAJITRAM KPN': 'Rajit Ram (Driver & Langar Sewa)',
    
    // Gurmit Singh
    'GURMIT SINGH': 'Gurmit Singh (Patient Care)',
    'GURMIT SINGH PADOL': 'Gurmit Singh (Patient Care)',
    'PADOL': 'Gurmit Singh (Patient Care)',
    
    // Hardyal Singh - EXCLUDE Mahaluxmi
    'HARDYAL SINGH': 'Hardyal Singh (Langar Sewa)',
    'HARDYAL': 'Hardyal Singh (Langar Sewa)',
    
    // Maha Singh - ONLY if it's "MAHA SINGH" or "MAHA SIN", not "MAHALUXMI"
    'MAHA SINGH': 'Maha Singh (Langar Sewa)',
    'MAHA SIN': 'Maha Singh (Langar Sewa)',
    
    // Ramandeep
    'RAMANDEEP': 'Ramandeep Kaur (Patient Care)',
    'RAMANDEEP HOSPITAL': 'Ramandeep Kaur (Patient Care)',
    
    // Balwinder Singh
    'BALVINDER SINGH': 'Balwinder singh (Langar Sewa)',
    'BALWINDER': 'Balwinder singh (Langar Sewa)',
    
    // Dheeraj
    'DHEERAJ': 'Dheeraj Kumar (Driver)',
    'DHEERAJ KUMAR': 'Dheeraj Kumar (Driver)',
    
    // Manejar Kumar
    'MANEJAR': 'Manejar kumar (Cow Care Taker)',
    'MANEJAR KUMAR': 'Manejar kumar (Cow Care Taker)',
    'MANEJAR /JAYPRAKA': 'Manejar kumar (Cow Care Taker)',
    
    // Miss Puja
    'MISS PUJ': 'Miss Puja (Cow Care Taker)',
    'MISS PUJA': 'Miss Puja (Cow Care Taker)',
    'PUJA': 'Miss Puja (Cow Care Taker)',
    
    // Shoor vir singh
    'SHOOR VIR': 'Shoor vir singh (Building Care Taker)',
    'SHOOR VI': 'Shoor vir singh (Building Care Taker)',
    
    // Dayal padol mistri
    'DAYAL PADOL': 'Dayal padol mistri (Gardner)',
    'DAYAL PA': 'Dayal padol mistri (Gardner)',
    'DAYALA P': 'Dayal padol mistri (Gardner)',
    
    // Gurjeet Singh
    'GURJEET': 'Gurjeet Singh (Patient Care)',
    'GURJEET SINGH': 'Gurjeet Singh (Patient Care)',
    
    // Shivinder Kaur
    'SHIVINDER': 'Shivinder Kaur (Patient Care)',
    'SHIVINDE': 'Shivinder Kaur (Patient Care)',
    
    // Jaspal Singh
    'NEW SANT': 'Jaspal Singh (Gurmukhi Teacher)',
    
    // Satwinder Singh
    'SATWINDER': 'Satwinder Singh (Gurmukhi Teacher)',
    'SATWINDE': 'Satwinder Singh (Gurmukhi Teacher)',
    
    // Akshay Kumar
    'AKSHAY KUMAR': 'Akshay Kumar (Cow Care Taker)',
    'AAKSHAY KU': 'Akshay Kumar (Cow Care Taker)',
    
    // NEW: Jai Kishan
    'JAI KISHAN': 'Jai Kishan (Cow Care Taker)',
    'JAI KISHAN NEWCOWCARETAKER': 'Jai Kishan (Cow Care Taker)',
    
    // NEW: Lajja Ram
    'LAJJA RAM': 'Lajja Ram (Cow Care Taker)',
    'LAJJA RA': 'Lajja Ram (Cow Care Taker)',
  };
  
  // Check manual mapping first (with partial matching)
  for (const [key, targetName] of Object.entries(manualMap)) {
    if (upperDesc.includes(key)) {
      const match = this.suppList.find(s => s.supplierName === targetName);
      if (match) return match;
    }
  }
  
  // ============== STEP 2: EXCLUSION RULES ==============
  // Check for Mahaluxmi - should NOT match Maha Singh
  if (upperDesc.includes('MAHALUXMI') || upperDesc.includes('MAHALAXMI')) {
    // This is a paint/hardware store, not Maha Singh
    console.log('Excluding Mahaluxmi from Maha Singh match');
    // Continue with other matching logic, but don't match Maha Singh
  }
  
  // ============== STEP 3: DYNAMIC FLEXIBLE MATCHING ==============
  
  // Clean the description further for matching
  const cleanDesc = this.cleanDescriptionForMatching(upperDesc);
  const descWords = cleanDesc.split(/\s+/).filter(w => w.length > 2);
  
  // Special handling for Mahaluxmi - create a temporary exclusion
  const isMahaluxmi = upperDesc.includes('MAHALUXMI') || upperDesc.includes('MAHALAXMI');
  
  // Try to find name patterns in description
  for (let s of this.suppList) {
    if (!s.supplierName) continue;
    
    // Get base supplier name without parentheses
    const supplierBase = s.supplierName.split('(')[0].trim();
    const supplierUpper = supplierBase.toUpperCase();
    const supplierWords = supplierUpper.split(/\s+/).filter((w:any) => w.length > 2);
    
    // Skip Maha Singh if description contains Mahaluxmi
    if (isMahaluxmi && supplierUpper.includes('MAHA SINGH')) {
      continue; // Skip this supplier for Mahaluxmi descriptions
    }
    
    // CASE 1: Check if supplier name appears as a substring
    const supplierNoSpaces = supplierUpper.replace(/\s+/g, '');
    const descNoSpaces = upperDesc.replace(/\s+/g, '');
    
    if (descNoSpaces.includes(supplierNoSpaces) && !this.isFalsePositive(supplierUpper, upperDesc)) {
      return s;
    }
    
    // CASE 2: Check if supplier name parts appear in order
    let matchCount = 0;
    let lastIndex = -1;
    
    for (let word of supplierWords) {
      const foundIndex = descWords.findIndex((w, idx) => 
        idx > lastIndex && (w === word || this.isSimilarWord(w, word))
      );
      
      if (foundIndex > lastIndex) {
        matchCount++;
        lastIndex = foundIndex;
      }
    }
    
    // If we matched at least 50% of supplier words in order, it's a good match
    if (supplierWords.length > 0 && matchCount >= Math.ceil(supplierWords.length / 2)) {
      // Double-check for false positives
      if (!this.isFalsePositive(supplierUpper, upperDesc)) {
        return s;
      }
    }
    
    // CASE 3: Check for first name + last initial pattern
    if (supplierWords.length >= 2) {
      const firstWord = supplierWords[0];
      const lastWord = supplierWords[supplierWords.length - 1];
      
      for (let descWord of descWords) {
        if (descWord.startsWith(firstWord) && descWord.length > firstWord.length) {
          if (!this.isFalsePositive(supplierUpper, upperDesc)) {
            return s;
          }
        }
      }
    }
  }
  
  // ============== STEP 4: FALLBACK TO ORIGINAL MATCHING ==============
  return this.originalMatchingLogic(description);
}

// Helper method to check for false positives
isFalsePositive(supplierName: string, description: string): boolean {
  // Maha Singh vs Mahaluxmi check
  if (supplierName.includes('MAHA SINGH') && 
      (description.includes('MAHALUXMI') || description.includes('MAHALAXMI'))) {
    return true; // This is a false positive
  }
  
  // Add more false positive checks here as needed
  
  return false;
}

// Update cleanDescriptionForMatching to better handle store names
cleanDescriptionForMatching(desc: string): string {
  // First, identify and preserve store names that might contain multiple words
  const storeIndicators = ['PAINTS', 'HARDWARE', 'STORE', 'SHOP', 'MART', 'ENTERPRISES'];
  
  let cleaned = desc
    .replace(/TO TRANSFER|TRANSFER|NEFT|IMPS|UPI|RTGS|UTR|REF|NO|MOB|BAL|AVAILABLE|OTHERS?|INB|OUTB|SBI|SBIN|HDFC|ICICI|UBIN|PUNB|IOBA|KKBK|PSIB|IDIB/g, ' ')
    .replace(/[0-9\-/]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  return cleaned;
}

// Update findMatchingSupplierWithDetails to include false positive check
findMatchingSupplierWithDetails(description: string): { supplier: any, score: number, matchedWords: string[] } {
  if (!description) return { supplier: null, score: 0, matchedWords: [] };
  
  const supplier = this.findMatchingSupplier(description);
  
  if (!supplier) {
    return { supplier: null, score: 0, matchedWords: [] };
  }
  
  // Additional validation for Maha Singh vs Mahaluxmi
  if (supplier.supplierName.includes('Maha Singh') && 
      description.toUpperCase().includes('MAHALUXMI')) {
    return { supplier: null, score: 0, matchedWords: [] }; // Treat as no match
  }
  
  // Calculate which words matched
  const matchedWords: string[] = [];
  const upperDesc = description.toUpperCase();
  const supplierName = supplier.supplierName.split('(')[0].trim().toUpperCase();
  const supplierWords = supplierName.split(/\s+/);
  
  for (let word of supplierWords) {
    if (word.length > 2 && upperDesc.includes(word)) {
      matchedWords.push(word);
    }
  }
  
  // Calculate score
  const significantWords = supplierWords.filter((w: string) => w.length > 2);
  const score = significantWords.length > 0 ? matchedWords.length / significantWords.length : 0;
  
  return {
    supplier: supplier,
    score: score,
    matchedWords: matchedWords
  };
}

// Update originalMatchingLogic to include Mahaluxmi check
originalMatchingLogic(description: string): any {
  if (!description) return null;
  
  const upperDesc = description.toUpperCase();
  const ignoreWords = ['SINGH', 'KAUR', 'KUMAR', 'THE', 'AND', 'SONS', 'STORE', 'NEW', 'ENT', 'AC'];
  
  // Special handling for Mahaluxmi
  const isMahaluxmi = upperDesc.includes('MAHALUXMI') || upperDesc.includes('MAHALAXMI');
  
  for (let s of this.suppList) {
    if (!s.supplierName) continue;
    
    // Skip Maha Singh for Mahaluxmi
    if (isMahaluxmi && s.supplierName.includes('Maha Singh')) {
      continue;
    }
    
    const nameParts = s.supplierName.toUpperCase().split(/\s+/);
    
    for (let part of nameParts) {
      if (part.length > 2 && !ignoreWords.includes(part)) {
        if (upperDesc.includes(part)) {
          // Double-check for false positives
          if (part === 'MAHA' && isMahaluxmi) {
            continue; // Skip this match
          }
          return s;
        }
      }
    }
  }
  
  return null;
}




// Add these properties
selectedFilterSupplier: string = 'all'; // 'all' or specific supplier name
supplierFilterList: any[] = []; // For dropdown options













// Add this property

// Computed property for filtered entries based on selected supplier
get filteredBySupplierEntries() {
  if (this.selectedFilterSupplier === 'all') {
    return this.displayedEntries;
  }
  return this.displayedEntries.filter(entry => 
    entry.supplierName === this.selectedFilterSupplier
  );
}

// Get all suppliers from API for filter dropdown
get allSuppliersForFilter(): any[] {
  // Return all suppliers from your API (suppList)
  return this.suppList.map(s => s.supplierName).sort();
}

// Get unique suppliers that actually appear in bulk entries (for stats)
get uniqueSuppliersInBulk(): any[] {
  const suppliers = this.bulkEntries
    .filter(entry => entry.isValid) // Only valid entries
    .map(entry => entry.supplierName)
    .filter((value, index, self) => self.indexOf(value) === index) // Get unique
    .sort();
  
  return suppliers;
}

// Method to handle supplier filter change
onSupplierFilterChange() {
  console.log('Filter changed to:', this.selectedFilterSupplier);
  // You can add any additional logic here if needed
}

// Get total amount for filtered entries
getFilteredTotalAmount(): number {
  return this.filteredBySupplierEntries.reduce((sum, entry) => sum + entry.billAmount, 0);
}

// Get selected count for filtered entries
getFilteredSelectedCount(): number {
  return this.filteredBySupplierEntries.filter(e => e.isSelected).length;
}




toggleSelectAll() {
  const allSelected = this.filteredBySupplierEntries
    .filter(e => e.isValid)
    .every(e => e.isSelected);
  
  this.filteredBySupplierEntries
    .filter(e => e.isValid)
    .forEach(e => e.isSelected = !allSelected);
}

toggleUnselectAll() {
  this.filteredBySupplierEntries
    .filter(e => e.isValid)
    .forEach(e => e.isSelected = false);
}
}
