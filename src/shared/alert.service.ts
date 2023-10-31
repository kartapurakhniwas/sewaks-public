import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomAlertService {
  private alertSubject = new BehaviorSubject<string | null>(null);

  showAlert(message: string): void {
    this.alertSubject.next(message);
  }

  hideAlert(): void {
    this.alertSubject.next(null);
  }

  getAlert(): Observable<string | null> {
    return this.alertSubject.asObservable();
  }
}
