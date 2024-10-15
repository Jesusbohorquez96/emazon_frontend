import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ArticleService } from 'src/app/services/article.service';
import { APP_CONSTANTS } from 'src/styles/constants';
import { Article } from 'src/app/models/article.model'; 

describe('ArticleService', () => {
  let service: ArticleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ArticleService]
    });

    service = TestBed.inject(ArticleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy(); 
  });

  it('should fetch articles with correct parameters', () => {
    const dummyArticles = [{ id: 1, name: 'Test Article' }, { id: 2, name: 'Another Article' }];
    const page = 1, size = 10, sortBy = 'name', sortDirection = 'asc', name = 'Test';

    service.getArticles(page, size, sortBy, sortDirection, name).subscribe(articles => {
      expect(articles.length).toBe(2);
      expect(articles).toEqual(dummyArticles);
    });

    const req = httpMock.expectOne(`${APP_CONSTANTS.API.BASE_URL}${APP_CONSTANTS.API.ARTICLE_ENDPOINT}?page=1&size=10&sortBy=name&sortDirection=asc&name=Test`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyArticles);
  });

  it('should save an article', () => {
    const dummyArticle: Article = { id: 1, name: 'Test Article', description: 'A test article', price: 100, stock: 10, categories: [], brand: 1};

    service.saveArticle(dummyArticle).subscribe(article => {
      expect(article).toEqual(dummyArticle);
    });

    const req = httpMock.expectOne(`${APP_CONSTANTS.API.BASE_URL}${APP_CONSTANTS.API.ARTICLE_ENDPOINT}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get(APP_CONSTANTS.SAVE.TYPE)).toBe(APP_CONSTANTS.SAVE.JSON); 
    req.flush(dummyArticle); 
  });

  it('should handle errors when fetching articles', () => {
    const page = 1, size = 10, sortBy = 'name', sortDirection = 'asc';
  
    service.getArticles(page, size, sortBy, sortDirection).subscribe(
      () => fail('Should have failed with a 500 error'),
      (error) => {
        expect(error.status).toBe(500);
      }
    );
  
    const req = httpMock.expectOne(`${APP_CONSTANTS.API.BASE_URL}${APP_CONSTANTS.API.ARTICLE_ENDPOINT}?page=1&size=10&sortBy=name&sortDirection=asc`);
    expect(req.request.method).toBe('GET');
  
    req.flush('Error fetching articles', { status: 500, statusText: 'Server Error' });
  });
  
  
});
