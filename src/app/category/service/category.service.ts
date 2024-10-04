import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'http://localhost:8080/categories'; 

  constructor(private http: HttpClient) { }

  getCategories(page: number, size: number, sortBy: string, sortDirection: string, name?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())  // Aquí se pasa el tamaño de página
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
