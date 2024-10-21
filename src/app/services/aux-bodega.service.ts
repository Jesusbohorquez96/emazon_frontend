import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONSTANTS } from '@/styles/constants';
import { Users } from '../models/aux-bodega.model';

@Injectable({
  providedIn: 'root'
})
export class auxBodegaService {

  private readonly apiUrl = 'http://localhost:8081/users/register_aux_bodega';  

  constructor(private readonly http: HttpClient) { }

  saveUsers(users: Users, _lastName: any, _password: any, _email: any, _idDocument: any, _phone: any, _birthdate: any, _rol: any): Observable<Users> {
    const headers = new HttpHeaders({
      [APP_CONSTANTS.SAVE.TYPE]: [APP_CONSTANTS.SAVE.JSON],

    });

    return this.http.post<Users>(this.apiUrl, users, { headers });
  }

}
