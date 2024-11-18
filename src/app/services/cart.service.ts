import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONSTANTS } from '@/styles/constants';
import { Cart } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly apiUrl = `${APP_CONSTANTS.API.CART_URL}${APP_CONSTANTS.API.CART_ENDPOINT}`;
  private readonly articlesFilterUrl = `${APP_CONSTANTS.API.CART_URL}/carts/articles/filter`;

  constructor(private readonly http: HttpClient) { }

  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getCartByUser(page: number, size: number, sortBy: string, sortDirection: string): Observable<any> {
    const token = this.getAuthToken();

    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection);

    return this.http.get<any>(this.apiUrl, { headers, params });
  }

  addToCart(cart: Cart): Observable<Cart> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '' 
    });
    return this.http.post<Cart>(this.apiUrl, cart, { headers });
  }

  deleteFromCart(cartId: number): Observable<void> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
    const url = `${this.apiUrl}${cartId}`;
    return this.http.delete<void>(url, { headers });
  }

  getFilteredArticles(
    page: number,
    size: number,
    sortBy: string,
    sortDirection: string,
    categoryName: string = '',
    brandName: string = ''
  ): Observable<any> {
    const token = this.getAuthToken();

    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection);

      if (categoryName) {
        params = params.set('categoryName', categoryName);
      }
      if (brandName) {
        params = params.set('brandName', brandName);
      }
    
      return this.http.get<any>(this.articlesFilterUrl, { headers, params });
  }
}