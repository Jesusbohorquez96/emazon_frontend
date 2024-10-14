import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from 'src/app/models/article.model'; 
import { APP_CONSTANTS } from 'src/styles/constants';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {


  private readonly apiUrl = `${APP_CONSTANTS.API.BASE_URL}${APP_CONSTANTS.API.ARTICLE_ENDPOINT}`;

  constructor(
    private readonly http: HttpClient, 
  ) { }

  getArticles(page: number, size: number, sortBy: string, sortDirection: string, name?: string): Observable<any> {
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

  saveArticle(article: Article): Observable<Article> {
    const headers = new HttpHeaders({
      [APP_CONSTANTS.SAVE.TYPE]: [APP_CONSTANTS.SAVE.JSON],
    });

    return this.http.post<Article>(this.apiUrl, article, { headers });
  }

}
