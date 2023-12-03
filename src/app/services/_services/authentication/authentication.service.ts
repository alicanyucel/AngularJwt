import { Injectable } from '@angular/core';
import { environment } from 'src/app/environmnet/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { User } from "../../../models";
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public userSubject: BehaviorSubject<User>;

  constructor(private http: HttpClient) {
    this.userSubject = new BehaviorSubject<User>(null);
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  logIn(email: string, password: string) {
    const url: string = `${environment.apiUrl}auth/login`;
    const body: any = { email: email, password: password };
    return this.http.post<any>(url, body)
      .pipe(map(res => {
        const user: User = {
          uid: res.userId, email: res.email, displayName: res.displayName, access_token: res.access_token, refresh_token: res.refresh_token
        };
        this.userSubject.next(user);
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      }));
  }

  refreshToken() {
    const url: string = `${environment.apiUrl}auth/token`;

    const body: any = {
      token : this.userValue.refresh_token
    };

    return this.http.post<any>(url, body)
      .pipe(map((token) => {
        const user: User = {
          uid: this.userValue.uid,
          displayName: this.userValue.displayName,
          email: this.userValue.email,
          access_token: token.access_token,
          refresh_token: this.userValue.refresh_token
        }
        this.userSubject.next(user);
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      }));
  }

  logout() {
    const url: string = `${environment.apiUrl}auth/logout/${this.userValue.refresh_token}`;
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }
    this.http.delete<any>(url, options).subscribe();
      localStorage.removeItem('user');
      this.userSubject.next(null);    
  }
}