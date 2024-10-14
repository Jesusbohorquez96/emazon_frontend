import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { APP_CONSTANTS } from 'src/styles/constants';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly apiUrl = `${APP_CONSTANTS.API.BASE_URL}${APP_CONSTANTS.API.CATEGORIES_ENDPOINT}`;
  

  constructor(private readonly http: HttpClient) { }

  getCategories(page: number, size: number, sortBy: string, sortDirection: string, name?: string): Observable<any> {
    let params = new HttpParams()
    .set(APP_CONSTANTS.PAGINATION.PAGE, page.toString())
    .set(APP_CONSTANTS.PAGINATION.SIZE, size.toString())
    .set(APP_CONSTANTS.PAGINATION.SORT_BY, sortBy)
    .set(APP_CONSTANTS.PAGINATION.SORT_DERECTION, sortDirection);

    if (name) {
      params = params.set(APP_CONSTANTS.NAME, name);
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  saveCategory(category: Category): Observable<Category> {
    let headers = new HttpHeaders({
      [APP_CONSTANTS.SAVE.TYPE] : [APP_CONSTANTS.SAVE.JSON],
      // 'Authorization': '••••••' 
    });

    return this.http.post<Category>(this.apiUrl, category, { headers });
  }
}
