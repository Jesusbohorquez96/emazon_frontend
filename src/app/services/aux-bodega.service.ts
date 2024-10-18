import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONSTANTS } from '@/styles/constants';
import { Users } from '../models/aux-bodega.model';

@Injectable({
  providedIn: 'root'
})
export class auxBodegaService {

  private apiUrl = 'http://localhost:8081/users/register_aux_bodega';  

  constructor(private http: HttpClient) { }

  saveUsers(users: Users, lastName?: any, password?: any, email?: any, idDocument?: any, phone?: any, birthdate?: any, rol?: any): Observable<Users> {
    const headers = new HttpHeaders({
      [APP_CONSTANTS.SAVE.TYPE]: [APP_CONSTANTS.SAVE.JSON],

    });

    return this.http.post<Users>(this.apiUrl, users, { headers });
  }

}
