import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Users } from '../models/aux-bodega.model';
import { APP_CONSTANTS } from '@/styles/constants';

@Injectable({
  providedIn: 'root'
})
export class auxBodegaService {

  private readonly apiUrl = `${APP_CONSTANTS.API.USER_URL}${APP_CONSTANTS.API.AUX_BODEGA_ENDPOINT}`;  

  constructor(private readonly http: HttpClient) { }

   private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  saveUsers(users: Users): Observable<any> {
    const token = this.getAuthToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.post<Users>(this.apiUrl, users, { headers });
  }
}
