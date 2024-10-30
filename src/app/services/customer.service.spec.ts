import { TestBed } from '@angular/core/testing';
import { CustomerService } from './customer.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Users } from '../models/aux-bodega.model';

describe('CustomerService', () => {
  let service: CustomerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CustomerService]
    });

    service = TestBed.inject(CustomerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call saveUsers with correct headers and data', () => {
    const mockUser: Users = {
      name: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'Password@123',
      idDocument: 12345678,
      phone: '+123456789',
      birthdate: '1990-01-01',
      rol: 1,
      id: 0
    };
    const authToken = 'mockAuthToken';
    localStorage.setItem('authToken', authToken); 

    service.saveUsers(mockUser).subscribe(response => {
      expect(response).toEqual(mockUser);
    });

    const req = httpMock.expectOne('http://localhost:8081/users/register_customer');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${authToken}`);
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush(mockUser);
  });

  it('should set empty Authorization header if no authToken is found', () => {
    const mockUser: Users = {
      name: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'Password@123',
      idDocument: 12345678,
      phone: '+123456789',
      birthdate: '1990-01-01',
      rol: 1,
      id: 0
    };

    localStorage.removeItem('authToken'); 

    service.saveUsers(mockUser).subscribe();

    const req = httpMock.expectOne('http://localhost:8081/users/register_customer');
    expect(req.request.headers.get('Authorization')).toBe('');
    req.flush(mockUser);
  });

  it('should retrieve authToken correctly from localStorage', () => {
    const authToken = 'testToken';
    localStorage.setItem('authToken', authToken);

    const result = service['getAuthToken']();
    expect(result).toBe(authToken);
  });

  it('should return null if authToken is not found in localStorage', () => {
    localStorage.removeItem('authToken');

    const result = service['getAuthToken']();
    expect(result).toBeNull();
  });
});
