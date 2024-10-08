import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Brand} from '../brand/models/brands.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  
  private readonly baseUrl = `${environment.apiBaseUrl}/brands`;

  constructor(private readonly http: HttpClient) {}

  getBrands(page: number, size: number, sortBy: string, sortDirection: string, name: string): Observable<any> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
        .set('sortBy', sortBy)
        .set('sortDirection', sortDirection);

    if (name) {
            params = params.set('name', name);
          }

    return this.http.get<any>(this.baseUrl, { params });
  }

  saveBrand(brand: Brand): Observable<Brand> {
    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        // 'Authorization': '••••••' 
      });
    return this.http.post<Brand>(this.baseUrl, brand , { headers });
  }
}
