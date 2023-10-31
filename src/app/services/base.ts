import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { MasterService } from './master';
@Injectable({
  providedIn: 'root',
})
export class BaseService {
 public BaseURL: string;
  Token: string = '';
  constructor(private http: HttpClient, public master: MasterService) {
    this.BaseURL = environment.apiUrl;
    // if (!window.origin.startsWith("http://localhost"))
    // this.BaseURL = window.origin.replace("www", "api") + "/";
  }

  open(url = '') {
    return this.http.get<any>(url).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  get(url = '', options = {}) {
    return this.http.get<any>(this.BaseURL + url, options).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  delete(url = '') {
    return this.http.delete(this.BaseURL + url).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  post(data:any, url = '') {
    return this.http.post<any>(this.BaseURL + url, data).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  put(data:any, url = '') {
    return this.http.put(this.BaseURL + url, data).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
}
