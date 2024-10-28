import { APP_CONSTANTS } from '@/styles/constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SupplyRequest } from '../models/supplies.model';

@Injectable({
  providedIn: 'root'
})
export class SuppliesService {

  private readonly apiUrl = `${APP_CONSTANTS.API.SUPPLIES_URL}${APP_CONSTANTS.API.SUPPLIES_ENDPOINT}`;

  constructor(private readonly http: HttpClient) { }

  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  updateStock(supply: SupplyRequest): Observable<any> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '' 
    });
    
    return this.http.put<any>(this.apiUrl, supply, { headers });
  }
}