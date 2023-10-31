import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpErrorResponse,
  HttpResponse,
} from "@angular/common/http";
import { map, takeUntil } from 'rxjs/operators';
import { Observable, throwError, of } from "rxjs";
import { Injectable } from "@angular/core";
import { MasterService } from "./master";
import { ActivationEnd, Router } from "@angular/router";
import { catchError } from "rxjs/operators";
import { StorageService } from 'src/app/services/storage.service';
import { HttpCancelService } from "./httpcancel.service";

@Injectable({
  providedIn: 'root',
})
export class APIInterceptor implements HttpInterceptor {
  token: any;
  constructor(public master: MasterService, private router: Router, private storage: StorageService,
    private httpCancelService: HttpCancelService) {
    router.events.subscribe(event => {
      // An event triggered at the end of the activation part of the Resolve phase of routing.
      if (event instanceof ActivationEnd) {
        // Cancel pending calls
        this.httpCancelService.cancelPendingRequests();
      }
    });
  }
  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    //handle your auth error or rethrow
    this.master.Processing = false;
    if (err.status === 401 || err.status === 403) {
      //navigate /delete cookies or whatever
      // console.log("errror");
      if (!this.router.url.includes("/public"))
        this.router.navigateByUrl(`/`);
        // this._snackBar.open("Time Out! You need to login again.", "Okay", { 'duration': 20000 });
      // if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
      return of(err.message); // or EMPTY may be appropriate here
    }
    // console.log(err.status);
    return throwError(err);
  }
  private dataHandler(event: HttpEvent<any>) {
    //handle your auth error or rethrow
    // this.master.Processing=false;
    if (event instanceof HttpResponse) {
      // console.log("event--->>>", event);
    }
    return event;
  }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // console.log("Insepector;",this.master);

    // let selCli: any = this.storage.get("sc");
    // let selWar: any = this.storage.get("sw");
    
    // this.master.selectedWarehouse = selWar;

    // if (selCli) {
    //   this.master.selectedClient = selCli;
    // }

    // if (!this.master.selectedClient) {
    //   this.master.selectedClient = 0;
    // }
    // console.log("dropdownd value",selCli , selWar );

    var authReq;
    let headers;

    this.token = this.storage.get('listoken');
    console.log(this.token, "this.tokenthis.tokenthis.token");
    
    
    if (this.token != undefined || null) {
      // console.log(this.token, "this.master.CurrentUser");
      // if (this.master.selectedWarehouse) {

        authReq = req.clone({
          headers: new HttpHeaders({
            // sw: this.master.selectedWarehouse.toString(),
            // sc: this.master.selectedClient.toString(),
            Authorization: "Bearer " + this.token
          }),
        });

      // } 
      // else {

      //   authReq = req.clone({
      //     headers: new HttpHeaders({
      //       Authorization: "Bearer " + this.master.CurrentUser?.password
      //     }),
      //   });
      // }

      return next.handle(authReq).pipe(
        map((x) => this.dataHandler(x)),
        catchError((x) => this.handleAuthError(x)),
        takeUntil(this.httpCancelService.onCancelPendingRequests())
      );
    } else {
      const authReq = req.clone({});
      //console.log("Receiving");
      return next
        .handle(authReq)
        .pipe(
          catchError((x) => this.handleAuthError(x)),
          takeUntil(this.httpCancelService.onCancelPendingRequests())
        );
    }

    //console.log('Intercepted HTTP call', authReq);
  }
}