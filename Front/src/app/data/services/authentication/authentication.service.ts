import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/data/schema/user';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private jwtHelper: any;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.jwtHelper = new JwtHelperService();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  signIn(username: string, password: string) {
    return this.http.post(`${environment.apiUrl}/login`, {username: username, password: password}).pipe(map(response => {
      const user = this.decodedToken(response['token']) as User; // response as User;

      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('accessToken', response['token']);
      localStorage.setItem('refreshToken', response['refresh_token']);
      this.currentUserSubject.next(user);
      return user;
    }));
  }

  signOut() {
    localStorage.clear();
    this.currentUserSubject.next(null);
    return true;
  }

  refreshToken() {
    const data =  {refresh_token: this.getRefreshToken()};
    return this.http.post(`${environment.apiUrl}/token/refresh`, data);
  }

  isTokenExpired() {
    const myRawToken = this.getToken();
    return this.jwtHelper.isTokenExpired(myRawToken);
  }

  decodedToken(myRawToken) {
    return this.jwtHelper.decodeToken(myRawToken);
  }

  getToken() {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  isAuthenticated() {
    return this.getToken() && !this.isTokenExpired();
  }
}
