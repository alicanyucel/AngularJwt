import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { AuthenticationService } from '../services/_services';
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private isRefreshing = false;
private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private _auth:AuthenticationService;
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler): Observable<HttpEvent<any>> {
return next.handle(request).pipe(catchError(err => {
 if ([401, 403].includes(err.status) && this._auth.userValue) {
   return next.handle(request).pipe(
     catchError(error => {
if (error instanceof HttpErrorResponse && error.status === 401) {
} else {
  return throwError(error);
}
}));
}
const error = (err && err.error && err.error.message) || err.statusText;
return throwError(error);
}))
}
}
