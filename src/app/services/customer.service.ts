import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Users } from '../models/aux-bodega.model';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private readonly apiUrl = 'http://localhost:8081/users/register_customer';  

  constructor(private readonly http: HttpClient) { }

   private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  saveUsers(users: Users): Observable<any> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '' 
    });

    return this.http.post<Users>(this.apiUrl, users, { headers });
  }
}