// aux-bodega.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { auxBodegaService } from './aux-bodega.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Users } from '../models/aux-bodega.model';
import { HttpHeaders } from '@angular/common/http';

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
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request with correct body and headers', () => {
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

    jest.spyOn(localStorage, 'getItem');

    service.saveUsers(mockUser).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8081/users/register_aux_bodega');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUser);

    const headers: HttpHeaders = req.request.headers;
    expect(headers.get('Authorization'));
    expect(headers.get('Content-Type'));

    req.flush(mockResponse);
  });

});
