import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Brand} from '../brand/models/brands.models';
import { APP_CONSTANTS } from 'src/styles/constants';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  
  private readonly baseUrl = `${APP_CONSTANTS.API.BASE_URL}${APP_CONSTANTS.API.BRANDS_ENDPOINT}`;

  constructor(private readonly http: HttpClient) {}

  getBrands(page: number, size: number, sortBy: string, sortDirection: string, name: string): Observable<any> {
    let params = new HttpParams()
    .set(APP_CONSTANTS.PAGINATION.PAGE, page.toString())
    .set(APP_CONSTANTS.PAGINATION.SIZE, size.toString())
    .set(APP_CONSTANTS.PAGINATION.SORT_BY, sortBy)
    .set(APP_CONSTANTS.PAGINATION.SORT_DERECTION, sortDirection);

    if (name) {
      params = params.set(APP_CONSTANTS.NAME, name);
    }

    return this.http.get<any>(this.baseUrl, { params });
  }

  saveBrand(brand: Brand): Observable<Brand> {
    let headers = new HttpHeaders({
      [APP_CONSTANTS.SAVE.TYPE] : [APP_CONSTANTS.SAVE.JSON],
        // 'Authorization': '••••••' 
      });
    return this.http.post<Brand>(this.baseUrl, brand , { headers });
  }
}
