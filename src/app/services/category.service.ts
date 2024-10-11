import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly apiUrl = `${environment.apiBaseUrl}/categories`;
  createCategory: any;

  constructor(private readonly http: HttpClient) { }

  getCategories(page: number, size: number, sortBy: string, sortDirection: string, name?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection);

    if (name) {
      params = params.set('name', name);
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  saveCategory(category: Category): Observable<Category> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Authorization': '••••••' 
    });

    return this.http.post<Category>(this.apiUrl, category, { headers });
  }
}
