import { APP_CONSTANTS } from '@/styles/constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject  } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private readonly apiUrl = `${APP_CONSTANTS.API.USER_URL}${APP_CONSTANTS.API.LOGIN_ENDPOINT}`;

  private readonly authStatus = new BehaviorSubject<boolean>(this.isAuthenticated());

  constructor(private readonly http: HttpClient,) { }
  
  saveLogin(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<any>(this.apiUrl, { email, password }, { headers });
  }

  setAuthStatus(isAuthenticated: boolean) {
    this.authStatus.next(isAuthenticated);
  }

  getAuthStatus(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  logout(): void {
    localStorage.removeItem('authToken'); 
    this.setAuthStatus(false);
  }

}
