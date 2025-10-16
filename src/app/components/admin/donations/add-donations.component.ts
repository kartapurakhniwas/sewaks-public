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
import * as XLSX from 'xlsx';

interface DonationData {
  donorName: string;
  amount: number;
  mode: number; // 1 = Cash, 2 = Cheque, 3 = NEFT/UPI
  receiptDate: string;
  chequeNo?: string;
  chequeDate?: string;
  neftDate?: string;
  neftAmount?: string;
  rowNumber: number;
  rawRow?: any; // store original row for reference
}

interface IgnoreRow {
  rowNumber: number;
  rowData: any;
  reason: string;
}
@Component({
  selector: 'app-add-donations',
  templateUrl: './add-donations.component.html',
  styleUrls: ['../style.scss'],
})

export class AddDonationsComponent implements OnInit {
  mode: any[] = [
    { value: 1, viewValue: 'Cash' },
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
  updateFlag: boolean = false;

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
    if (this.gl.setRowDataArray[0]) {
      this.GetByID();
    } else {
      this.getAllDonationsForRecieptNo();
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
          this.Form.controls['receiptDate'].setValue(m.lstModel[0]?.receiptDate);
          this.Form.controls['chequeDate'].setValue(m.lstModel[0]?.receiptDate);
        }
      }
    );
  }

  setValue(data: any) {
    // this.Form.controls['donorName'].setValue(data?.donorName);
    // this.Form.controls['donorId'].setValue(data?.donorId);
    // this.Form.controls['receiptNo'].setValue(data?.receiptNo);
    // this.Form.controls['receiptDate'].setValue(data?.receiptDate);
    // this.Form.controls['receiptAmount'].setValue(data?.receiptAmount);
    // this.Form.controls['bankAmount'].setValue(data?.bankAmount);
    // this.Form.controls['mode'].setValue(data?.mode);
    // this.Form.controls['image'].setValue(data?.image);
    // this.Form.controls['comments'].setValue(data?.comments);
    // this.Form.controls['dateofBankCredit'].setValue(data?.dateofBankCredit);
this.updateFlag = true;
  this.Form.controls['id'].setValue(data?.id);
this.Form.controls['donorName'].setValue(data?.donorName);
this.Form.controls['donorId'].setValue(data?.donorId);
this.Form.controls['donorAddress'].setValue(data?.donorAddress);
this.Form.controls['receiptNo'].setValue(data?.receiptNo);
this.Form.controls['receiptDate'].setValue(data?.receiptDate ? new Date(data.receiptDate) : new Date());
this.Form.controls['receiptAmount'].setValue(data?.receiptAmount);
this.Form.controls['bankAmount'].setValue(data?.bankAmount);
this.Form.controls['mode'].setValue(data?.mode);
this.Form.controls['chequeNo'].setValue(data?.chequeNo);
this.Form.controls['chequeDate'].setValue(data?.chequeDate ? new Date(data.chequeDate) : new Date());
this.Form.controls['image'].setValue(data?.image);
this.Form.controls['comments'].setValue(data?.comments);
this.Form.controls['dateofBankCredit'].setValue(data?.dateofBankCredit ? new Date(data.dateofBankCredit) : new Date());
this.Form.controls['status'].setValue(data?.status);

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
    data.receiptNo = String(data.receiptNo );
    console.log("🚀 ~ AddDonationsComponent ~ add ~ data.recieptNo:", data.recieptNo)
    
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

  if (data1.mode == 1) {
      data1.chequeNo = null;
      // data1.chequeDate = new Date();
      // data1.dateofBankDebit = new Date();
      data1.chequeDate = data1.chequeDate ? moment(data1.chequeDate).format('YYYY-MM-DDTHH:mm:ss') : moment(new Date()).format('YYYY-MM-DDTHH:mm:ss')
      data1.dateofBankDebit = data1.dateofBankDebit ? moment(data1.dateofBankDebit).format('YYYY-MM-DDTHH:mm:ss') : moment(new Date()).format('YYYY-MM-DDTHH:mm:ss')
      data1.neftAmount = '0';
      // data1.neftDate = new Date();
      data1.neftDate = data1.neftDate ? moment(data1.neftDate).format('YYYY-MM-DDTHH:mm:ss') : moment(new Date()).format('YYYY-MM-DDTHH:mm:ss')
    }

    if (this.Form.value.mode == 2) {
      data1.neftAmount = '0';
      // data1.neftDate = new Date();
      data1.neftDate = data1.neftDate ? moment(data1.neftDate).format('YYYY-MM-DDTHH:mm:ss') : moment(new Date()).format('YYYY-MM-DDTHH:mm:ss')
      
    }

    if (this.Form.value.mode == 3) {
      data1.chequeNo = '0';
      // data1.chequeDate = new Date();
      data1.chequeDate = data1.chequeDate ? moment(data1.chequeDate).format('YYYY-MM-DDTHH:mm:ss') : moment(new Date()).format('YYYY-MM-DDTHH:mm:ss')
    }
 data1.receiptNo = data1.receiptNo.toString();
    if (this.Form.valid) {
      data1.receiptDate = data1.receiptDate ? moment(data1.receiptDate).format('YYYY-MM-DDTHH:mm:ss') : moment(new Date()).format('YYYY-MM-DDTHH:mm:ss')
      this.srv.update(data1).subscribe((m) => {
        if (m.respStatus) {
          this.updateFlag = false;
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
      this.updateFlag = false;
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
donationsList: DonationData[] = [];
  ignoreList: IgnoreRow[] = [];

  private MONTHS = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];

  /** ---- helpers ---- */
  private parseNumber(v: any): number | null {
    if (v === null || v === undefined) return null;
    const s = String(v).replace(/[, ]/g, '');
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }

  private looksLikeDateHeader(h: string): boolean {
    h = h.toLowerCase();
    return (h.includes('date') && !h.includes('value date')) || h === 'date';
  }

  private looksLikeValueDateHeader(h: string): boolean {
    h = h.toLowerCase();
    return h.includes('value') && h.includes('date');
  }

  private looksLikeNarrationHeader(h: string): boolean {
    h = h.toLowerCase();
    return ['description', 'narration', 'particulars', 'details']
      .some(k => h.includes(k));
  }

  private looksLikeCreditHeader(h: string): boolean {
    h = h.toLowerCase();
    return h.includes('credit') || h.includes('cr amt') || h.endsWith('cr');
  }

  private looksLikeDebitHeader(h: string): boolean {
    h = h.toLowerCase();
    return h.includes('debit') || h.includes('dr amt') || h.endsWith('dr');
  }
private normalizeText(s: string): string {
  return s
    .replace(/["“”]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
  /** Extract donor name specifically from narration/description text */
extractDonorNameFromNarration(narr: string): { name?: string; confidence: number } {
  const n = this.normalizeText(narr);

  // 1) BY TRANSFER-<REF>-<NAME>-- (most common in your screenshot)
  const byTransfer = /BY\s+TRANSFER[-–—]\s*([A-Z0-9]+)\s*[-–—]+\s*([A-Za-z][A-Za-z\s.'-]{2,}?)(?:[-–—]{1,}|$)/i;
  const m1 = n.match(byTransfer);
  if (m1?.[2]) {
    const name = m1[2].replace(/[-–—]+$/,'').trim();
    return { name, confidence: 0.95 };
  }

  // 2) UPI/<RRN>/<NAME> or UPI-<RRN>-<NAME>
  const upiLike = /UPI[\/-][A-Z0-9]+[\/-]\s*([A-Za-z][A-Za-z\s.'-]{2,})/i;
  const m2 = n.match(upiLike);
  if (m2?.[1]) return { name: m2[1].trim(), confidence: 0.9 };

  // 3) NEFT/IMPS <REF> <NAME> or NEFT-<UTR>-<NAME>
  const neftLike = /(NEFT|IMPS)[\s-]+[A-Z0-9]+(?:\s|-)+([A-Za-z][A-Za-z\s.'-]{2,})/i;
  const m3 = n.match(neftLike);
  if (m3?.[2]) return { name: m3[2].trim(), confidence: 0.85 };

  // 4) TRANSFER FROM <ACCNO> - <NAME>
  const transferFrom = /TRANSFER\s+FROM\s+\d{6,}\s*[-:–—]*\s*([A-Za-z][A-Za-z\s.'-]{2,})/i;
  const m4 = n.match(transferFrom);
  if (m4?.[1]) return { name: m4[1].trim(), confidence: 0.8 };

  // 5) fragile fallback: last alpha run at end (avoid months, keywords)
  const tailAlpha = /([A-Za-z][A-Za-z\s.'-]{2,})$/i;
  const m5 = n.match(tailAlpha);
  if (m5?.[1]) {
    const cand = m5[1].trim();
    const lc = cand.toLowerCase();
    const bad =
      lc.length < 3 ||
      this.MONTHS.some(m => lc.includes(m)) ||
      /(sbi|by transfer|neft|imps|upi|utr|ref|rrn|from|to|acct|acc|a\/c)/i.test(lc);
    if (!bad) return { name: cand, confidence: 0.5 };
  }

  return { confidence: 0 };
}

/** infer mode from narration */
inferMode(narr: string): number {
  const s = narr.toUpperCase();
  if (s.includes('CASH') || s.includes('CDM')) return 1;
  if (s.includes('CHEQUE') || s.includes('CHQ')) return 2;
  // UPI/NEFT/IMPS/BY TRANSFER => 3
  return 3;
}

/** pick a date string -> ISO */
toIsoDate(d: any): string {
  // try dd-mm-yyyy / dd/mm/yyyy / Excel serials
  if (d instanceof Date) return moment(d).format('YYYY-MM-DDTHH:mm:ss');
  const s = String(d ?? '').trim();

  // excel serial number?
  const maybeNum = Number(s);
  if (Number.isFinite(maybeNum) && maybeNum > 20000 && maybeNum < 60000) {
    // rough guardrails: excel serials in recent years
    const excelEpoch = new Date(1899, 11, 30);
    const ms = excelEpoch.getTime() + maybeNum * 24 * 60 * 60 * 1000;
    return moment(ms).format('YYYY-MM-DDTHH:mm:ss');
  }

  const m = moment(s, ['DD-MM-YYYY','DD/MM/YYYY','YYYY-MM-DD','D MMM YYYY','DD MMM YYYY'], true);
  if (m.isValid()) return m.format('YYYY-MM-DDTHH:mm:ss');

  // last resort: now
  return moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
}
  /** ---- main method ---- */
  processBankStatement(event: any) {
    const file = event.target.files[0];
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true });

      if (!rows.length) return;

      const header = (rows[0] || []).map((h: any) => String(h ?? '').trim());
      let col = {
        date: -1,
        valueDate: -1,
        narration: -1,
        credit: -1,
        debit: -1
      };

      header.forEach((h, i) => {
        if (col.narration === -1 && this.looksLikeNarrationHeader(h)) col.narration = i;
        if (col.credit === -1 && this.looksLikeCreditHeader(h)) col.credit = i;
        if (col.debit === -1 && this.looksLikeDebitHeader(h)) col.debit = i;
        if (col.date === -1 && this.looksLikeDateHeader(h)) col.date = i;
        if (col.valueDate === -1 && this.looksLikeValueDateHeader(h)) col.valueDate = i;
      });

      this.donationsList = [];
      this.ignoreList = [];

      for (let r = 1; r < rows.length; r++) {
        const row = rows[r] || [];
        const rowNumber = r + 1;

        const creditVal = col.credit >= 0 ? this.parseNumber(row[col.credit]) : null;
        if ((creditVal ?? 0) <= 0) continue; // not incoming donation

        const narration = col.narration >= 0 
          ? String(row[col.narration] ?? '') 
          : '';

        const { name: donorName, confidence } = this.extractDonorNameFromNarration(narration);
        const mode = this.inferMode(narration);
        const dateCell = (col.valueDate >= 0 ? row[col.valueDate] : null) ?? (col.date >= 0 ? row[col.date] : null);
        const receiptDate = this.toIsoDate(dateCell);

        if (donorName && confidence >= 0.8) {
          const iso = moment(receiptDate).format('YYYY-MM-DDTHH:mm:ss');
          const amount = Number(creditVal);

          this.donationsList.push({
            donorName,
            amount,
            mode,
            receiptDate: iso,
            chequeNo: mode === 2 ? 'UNKNOWN' : '0',
            chequeDate: mode === 2 ? iso : '',
            neftAmount: mode === 3 ? String(amount) : '0',
            neftDate: mode === 3 ? iso : '',
            rawRow: row,
            rowNumber
          });
        } else {
          this.ignoreList.push({
            rowNumber,
            rowData: row,
            reason: donorName ? `Low confidence name (${Math.round(confidence*100)}%)` : 'Donor name not found'
          });
        }
      }

      console.log('Donations:', this.donationsList);
      console.log('Ignore list:', this.ignoreList);
    };

    reader.readAsBinaryString(file);
  }
}