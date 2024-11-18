import { TestBed } from '@angular/core/testing';
import { auxBodegaService } from './aux-bodega.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Users } from '../models/aux-bodega.model';

describe('auxBodegaService', () => {
  let service: auxBodegaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [auxBodegaService]
    });

    service = TestBed.inject(auxBodegaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request with the correct body and Authorization header when token is present', () => {
    const mockUser: Users = {
      id: 1,
      name: 'Test Name',
      lastName: 'Test LastName',
      password: 'TestPassword',
      email: 'test@example.com',
      idDocument: 123456789,
      phone: '555-555-5555',
      birthdate: '1990-01-01',
      rol: 1
    };

    const mockResponse = { success: true };
    const token = 'mockedAuthToken';
    localStorage.setItem('authToken', token);

    service.saveUsers(mockUser).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8081/users/register_aux_bodega');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUser);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    expect(req.request.headers.get('Content-Type')).toBe('application/json');

    req.flush(mockResponse);
  });

  it('should send a POST request without Authorization header when token is missing', () => {
    const mockUser: Users = {
      id: 1,
      name: 'Test Name',
      lastName: 'Test LastName',
      password: 'TestPassword',
      email: 'test@example.com',
      idDocument: 123456789,
      phone: '555-555-5555',
      birthdate: '1990-01-01',
      rol: 1
    };

    const mockResponse = { success: true };
    localStorage.removeItem('authToken'); // Ensure no token is present

    service.saveUsers(mockUser).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8081/users/register_aux_bodega');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUser);
    expect(req.request.headers.get('Authorization')).toBeNull();
    expect(req.request.headers.get('Content-Type')).toBe('application/json');

    req.flush(mockResponse);
  });

  it('should retrieve authToken correctly from localStorage', () => {
    const token = 'testAuthToken';
    localStorage.setItem('authToken', token);

    const result = service['getAuthToken']();
    expect(result).toBe(token);
  });

  it('should return null if authToken is not present in localStorage', () => {
    localStorage.removeItem('authToken');

    const result = service['getAuthToken']();
    expect(result).toBeNull();
  });

  it('should handle server errors gracefully', () => {
    const mockUser: Users = {
      id: 1,
      name: 'Test Name',
      lastName: 'Test LastName',
      password: 'TestPassword',
      email: 'test@example.com',
      idDocument: 123456789,
      phone: '555-555-5555',
      birthdate: '1990-01-01',
      rol: 1
    };

    const mockError = {
      status: 500,
      statusText: 'Internal Server Error'
    };

    service.saveUsers(mockUser).subscribe(
      () => fail('Expected an error, but request succeeded.'),
      (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');
      }
    );

    const req = httpMock.expectOne('http://localhost:8081/users/register_aux_bodega');
    req.flush(null, mockError);
  });

  it('should handle 400 Bad Request errors correctly', () => {
    const mockUser: Users = {
      id: 1,
      name: 'Test Name',
      lastName: 'Test LastName',
      password: 'TestPassword',
      email: 'test@example.com',
      idDocument: 123456789,
      phone: '555-555-5555',
      birthdate: '1990-01-01',
      rol: 1
    };

    const mockError = {
      status: 400,
      statusText: 'Bad Request',
      error: { message: 'Validation failed' }
    };

    service.saveUsers(mockUser).subscribe(
      () => fail('Expected an error, but request succeeded.'),
      (error) => {
        expect(error.status).toBe(400);
        expect(error.error.message).toBe('Validation failed');
      }
    );

    const req = httpMock.expectOne('http://localhost:8081/users/register_aux_bodega');
    req.flush(mockError.error, mockError);
  });
});
