import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrandService } from './brand.service';
import { Brand } from '../models/brand.model';

describe('BrandService', () => {
  let service: BrandService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BrandService],
    });

    service = TestBed.inject(BrandService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getBrands', () => {
    it('should fetch a list of brands with correct parameters', () => {
      const mockBrands = {
        content: [
          { id: 1, name: 'Brand 1', description: 'Description 1' },
          { id: 2, name: 'Brand 2', description: 'Description 2' },
        ],
        totalPages: 1,
      };

      service.getBrands(0, 10, 'name', 'asc', 'Brand').subscribe((brands) => {
        expect(brands).toEqual(mockBrands);
      });

      const req = httpMock.expectOne((request) =>
        request.url === service['baseUrl'] &&
        request.params.get('page') === '0' &&
        request.params.get('size') === '10' &&
        request.params.get('sortBy') === 'name' &&
        request.params.get('sortDirection') === 'asc' &&
        request.params.get('name') === 'Brand'
      );

      expect(req.request.method).toBe('GET');
      req.flush(mockBrands);
    });

    it('should exclude the name parameter when it is not provided', () => {
      const mockBrands = {
        content: [
          { id: 1, name: 'Brand 1', description: 'Description 1' },
          { id: 2, name: 'Brand 2', description: 'Description 2' },
        ],
        totalPages: 1,
      };

      service.getBrands(0, 10, 'name', 'asc', '').subscribe((brands) => {
        expect(brands).toEqual(mockBrands);
      });

      const req = httpMock.expectOne((request) =>
        request.url === service['baseUrl'] &&
        request.params.get('page') === '0' &&
        request.params.get('size') === '10' &&
        request.params.get('sortBy') === 'name' &&
        request.params.get('sortDirection') === 'asc' &&
        !request.params.has('name')
      );

      expect(req.request.method).toBe('GET');
      req.flush(mockBrands);
    });
  });

  describe('#saveBrand', () => {
    it('should include Authorization header when token is present', () => {
      const mockBrand: Brand = { id: 1, name: 'Brand 1', description: 'Description 1' };
      const mockToken = 'testAuthToken';
      localStorage.setItem('authToken', mockToken);

      service.saveBrand(mockBrand).subscribe((response) => {
        expect(response).toEqual(mockBrand);
      });

      const req = httpMock.expectOne(service['baseUrl']);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockBrand);
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(mockBrand);
    });

    it('should not include Authorization header when token is absent', () => {
      const mockBrand: Brand = { id: 1, name: 'Brand 1', description: 'Description 1' };
      localStorage.removeItem('authToken');

      service.saveBrand(mockBrand).subscribe((response) => {
        expect(response).toEqual(mockBrand);
      });

      const req = httpMock.expectOne(service['baseUrl']);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockBrand);
      expect(req.request.headers.get('Authorization')).toBeNull();
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(mockBrand);
    });
  });

  describe('#getAuthToken', () => {
    it('should retrieve token from localStorage', () => {
      const mockToken = 'testAuthToken';
      localStorage.setItem('authToken', mockToken);

      const token = service['getAuthToken']();
      expect(token).toBe(mockToken);
    });

    it('should return null if token is not found', () => {
      localStorage.removeItem('authToken');

      const token = service['getAuthToken']();
      expect(token).toBeNull();
    });
  });
});
