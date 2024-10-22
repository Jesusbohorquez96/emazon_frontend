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

  it('should set category parameter when provided', () => {
    const page = 1;
    const size = 10;
    const sortBy = 'name';
    const sortDirection = 'ASC';
    const category = 'Electronics';

    service.getArticles(page, size, sortBy, sortDirection, undefined, category).subscribe();

    const req = httpMock.expectOne((request) => {
      return request.params.has(APP_CONSTANTS.PAGINATION.PAGE) &&
        request.params.get(APP_CONSTANTS.PAGINATION.PAGE) === page.toString() &&
        request.params.has('category') && 
        request.params.get('category') === category;
    });

    expect(req.request.method).toBe('GET');
  });

  it('should set brand parameter when provided', () => {
    const page = 1;
    const size = 10;
    const sortBy = 'name';
    const sortDirection = 'ASC';
    const brand = 'BrandX';

    service.getArticles(page, size, sortBy, sortDirection, undefined, undefined, brand).subscribe();

    const req = httpMock.expectOne((request) => {
      return request.params.has(APP_CONSTANTS.PAGINATION.PAGE) &&
        request.params.get(APP_CONSTANTS.PAGINATION.PAGE) === page.toString() &&
        request.params.has('brand') &&
        request.params.get('brand') === brand;
    });

    expect(req.request.method).toBe('GET');
  });

  it('should set name parameter when provided', () => {
    const page = 1;
    const size = 10;
    const sortBy = 'name';
    const sortDirection = 'ASC';
    const name = 'Laptop';

    service.getArticles(page, size, sortBy, sortDirection, name).subscribe();

    const req = httpMock.expectOne((request) => {
      return request.params.has(APP_CONSTANTS.PAGINATION.PAGE) &&
        request.params.get(APP_CONSTANTS.PAGINATION.PAGE) === page.toString() &&
        request.params.has(APP_CONSTANTS.NAME) &&
        request.params.get(APP_CONSTANTS.NAME) === name;
    });

    expect(req.request.method).toBe('GET');
  });

});
