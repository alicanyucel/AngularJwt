import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../app/environmnet/environment';
import { AuthenticationService } from '../../app/services/_services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(private _auth: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to the api url
        const user = this._auth.userValue;
        const isLoggedIn = user && user.access_token;
        const isApiUrl = request.url.startsWith(environment.apiUrl);
        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: {
                    'Authorization': `Bearer ${user.access_token}`
                }
            })
        }

        return next.handle(request)
    }
}