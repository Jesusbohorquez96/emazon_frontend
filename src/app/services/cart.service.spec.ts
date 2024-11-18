import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CartService } from './cart.service';
import { APP_CONSTANTS } from '@/styles/constants';
import { Cart } from '../models/cart.model';

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CartService]
    });

    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCartByUser', () => {
    it('should send GET request with correct params and Authorization header when token is present', () => {
      const page = 1;
      const size = 10;
      const sortBy = 'articleId';
      const sortDirection = 'ASC';
      const mockResponse = { content: [], totalPages: 1 };
      const token = 'mockAuthToken';

      localStorage.setItem('authToken', token);

      service.getCartByUser(page, size, sortBy, sortDirection).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne((request) =>
        request.url === `${APP_CONSTANTS.API.CART_URL}${APP_CONSTANTS.API.CART_ENDPOINT}` &&
        request.params.get('page') === page.toString() &&
        request.params.get('size') === size.toString() &&
        request.params.get('sortBy') === sortBy &&
        request.params.get('sortDirection') === sortDirection
      );

      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      req.flush(mockResponse);
    });

    it('should send GET request without Authorization header when token is missing', () => {
      const page = 1;
      const size = 10;
      const sortBy = 'articleId';
      const sortDirection = 'ASC';
      const mockResponse = { content: [], totalPages: 1 };

      localStorage.removeItem('authToken');

      service.getCartByUser(page, size, sortBy, sortDirection).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne((request) =>
        request.url === `${APP_CONSTANTS.API.CART_URL}${APP_CONSTANTS.API.CART_ENDPOINT}` &&
        request.params.get('page') === page.toString() &&
        request.params.get('size') === size.toString() &&
        request.params.get('sortBy') === sortBy &&
        request.params.get('sortDirection') === sortDirection
      );

      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('');
      req.flush(mockResponse);
    });
  });

  describe('addToCart', () => {
    it('should send POST request with correct body and Authorization header when token is present', () => {
      const mockCart: Cart = { articleId: 1, quantity: 2 };
      const mockResponse = { ...mockCart, id: 123 };
      const token = 'mockAuthToken';

      localStorage.setItem('authToken', token);

      service.addToCart(mockCart).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${APP_CONSTANTS.API.CART_URL}${APP_CONSTANTS.API.CART_ENDPOINT}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCart);
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(mockResponse);
    });

    it('should send POST request without Authorization header when token is missing', () => {
      const mockCart: Cart = { articleId: 1, quantity: 2 };
      const mockResponse = { ...mockCart, id: 123 };

      localStorage.removeItem('authToken');

      service.addToCart(mockCart).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${APP_CONSTANTS.API.CART_URL}${APP_CONSTANTS.API.CART_ENDPOINT}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe('');
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(mockResponse);
    });
  });

  describe('deleteFromCart', () => {
    it('should send DELETE request with Authorization header when token is present', () => {
      const cartId = 123;
      const token = 'mockAuthToken';

      localStorage.setItem('authToken', token);

      service.deleteFromCart(cartId).subscribe((response) => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(`${APP_CONSTANTS.API.CART_URL}${APP_CONSTANTS.API.CART_ENDPOINT}${cartId}`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      req.flush(null);
    });

    it('should send DELETE request without Authorization header when token is missing', () => {
      const cartId = 123;

      localStorage.removeItem('authToken');

      service.deleteFromCart(cartId).subscribe((response) => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(`${APP_CONSTANTS.API.CART_URL}${APP_CONSTANTS.API.CART_ENDPOINT}${cartId}`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.get('Authorization')).toBe('');
      req.flush(null);
    });
  });

  describe('getFilteredArticles', () => {
    it('should send GET request with correct params and Authorization header when token is present', () => {
      const page = 1;
      const size = 5;
      const sortBy = 'name';
      const sortDirection = 'ASC';
      const categoryName = 'electronics';
      const brandName = 'sony';
      const mockResponse = { content: [], totalPages: 1 };
      const token = 'mockAuthToken';

      localStorage.setItem('authToken', token);

      service.getFilteredArticles(page, size, sortBy, sortDirection, categoryName, brandName).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne((request) =>
        request.url === `${APP_CONSTANTS.API.CART_URL}/carts/articles/filter` &&
        request.params.get('page') === page.toString() &&
        request.params.get('size') === size.toString() &&
        request.params.get('sortBy') === sortBy &&
        request.params.get('sortDirection') === sortDirection &&
        request.params.get('categoryName') === categoryName &&
        request.params.get('brandName') === brandName
      );

      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      req.flush(mockResponse);
    });

    it('should send GET request without Authorization header when token is missing', () => {
      const page = 1;
      const size = 5;
      const sortBy = 'name';
      const sortDirection = 'ASC';
      const categoryName = 'electronics';
      const brandName = 'sony';
      const mockResponse = { content: [], totalPages: 1 };

      localStorage.removeItem('authToken');

      service.getFilteredArticles(page, size, sortBy, sortDirection, categoryName, brandName).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne((request) =>
        request.url === `${APP_CONSTANTS.API.CART_URL}/carts/articles/filter` &&
        request.params.get('page') === page.toString() &&
        request.params.get('size') === size.toString() &&
        request.params.get('sortBy') === sortBy &&
        request.params.get('sortDirection') === sortDirection &&
        request.params.get('categoryName') === categoryName &&
        request.params.get('brandName') === brandName
      );

      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('');
      req.flush(mockResponse);
    });
  });
});
