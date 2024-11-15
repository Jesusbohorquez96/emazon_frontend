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
  });

  describe('getCartByUser', () => {
    it('should fetch cart items by user with the correct headers and params', () => {
      const mockResponse = { content: [], totalPages: 1 };
      const page = 1;
      const size = 10;
      const sortBy = 'articleId';
      const sortDirection = 'ASC';
      const token = 'test-token';
      localStorage.setItem('authToken', token);

      service.getCartByUser(page, size, sortBy, sortDirection).subscribe(response => {
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
  });

  describe('addToCart', () => {
    it('should send POST request to add item to cart with correct headers', () => {
      const mockCart: Cart = { articleId: 1, quantity: 2 };
      const token = 'test-token';
      localStorage.setItem('authToken', token);

      service.addToCart(mockCart).subscribe(response => {
        expect(response).toEqual(mockCart);
      });

      const req = httpMock.expectOne(`${APP_CONSTANTS.API.CART_URL}${APP_CONSTANTS.API.CART_ENDPOINT}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      expect(req.request.body).toEqual(mockCart);

      req.flush(mockCart);
    });
  });

  describe('deleteFromCart', () => {
    it('should send DELETE request to remove item from cart with correct headers', () => {
      const cartId = 1;
      const token = 'test-token';
      localStorage.setItem('authToken', token);

      service.deleteFromCart(cartId).subscribe(response => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(`${APP_CONSTANTS.API.CART_URL}${APP_CONSTANTS.API.CART_ENDPOINT}${cartId}`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);

      req.flush(null);
    });
  });
});
