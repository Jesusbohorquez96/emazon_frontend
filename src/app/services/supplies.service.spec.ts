import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SuppliesService } from './supplies.service';
import { APP_CONSTANTS } from '@/styles/constants';
import { SupplyRequest } from '../models/supplies.model';

describe('SuppliesService', () => {
  let service: SuppliesService;
  let httpMock: HttpTestingController;

  const mockSupplyRequest: SupplyRequest = {
    name: 'Test Supply',
    quantity: 10,
    status: 'active',
    articleId: 123
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SuppliesService]
    });
    service = TestBed.inject(SuppliesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#updateStock', () => {
    it('should call HTTP PUT with correct headers and body', () => {
      const mockToken = 'mock-auth-token';
      localStorage.setItem('authToken', mockToken);

      service.updateStock(mockSupplyRequest).subscribe();

      const expectedUrl = `${APP_CONSTANTS.API.SUPPLIES_URL}${APP_CONSTANTS.API.SUPPLIES_ENDPOINT}`;

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('PUT');
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      expect(req.request.body).toEqual(mockSupplyRequest);

      req.flush({});
    });

    it('should send an empty Authorization header if no token is available', () => {
      localStorage.removeItem('authToken');

      service.updateStock(mockSupplyRequest).subscribe();

      const expectedUrl = `${APP_CONSTANTS.API.SUPPLIES_URL}${APP_CONSTANTS.API.SUPPLIES_ENDPOINT}`;

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('PUT');
      expect(req.request.headers.get('Authorization')).toBe('');
      expect(req.request.body).toEqual(mockSupplyRequest);

      req.flush({});
    });
  });
});
