import { APP_CONSTANTS } from '@/styles/constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private readonly apiUrl = `${APP_CONSTANTS.API.USER_URL}${APP_CONSTANTS.API.LOGIN_ENDPOINT}`;

  constructor(private readonly http: HttpClient,) { }
  
  saveLogin(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<any>(this.apiUrl, { email, password }, { headers });
  }

  isAuthenticated(): boolean {
    
    return !!localStorage.getItem('authToken');
  }

  logout(): void {
    localStorage.removeItem('authToken'); 
  }

}
