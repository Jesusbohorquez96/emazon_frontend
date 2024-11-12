import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONSTANTS } from '@/styles/constants';
import { Cart } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  getArticles() {
    throw new Error('Method not implemented.');
  }

  private readonly apiUrl = `${APP_CONSTANTS.API.CART_URL}${APP_CONSTANTS.API.CART_ENDPOINT}`;

  constructor(private readonly http: HttpClient) { }

  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  addToCart(cart: Cart): Observable<Cart> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '' 
    });
    return this.http.post<Cart>(this.apiUrl, cart, { headers });
  }
}