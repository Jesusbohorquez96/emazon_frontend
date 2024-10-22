import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { auxBodegaService } from './aux-bodega.service';
import { APP_CONSTANTS } from '@/styles/constants';
import { Users } from '../models/aux-bodega.model';

describe('auxBodegaService', () => {
  let service: auxBodegaService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [auxBodegaService],
    });

    service = TestBed.inject(auxBodegaService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save users and return the user data', () => {
    const mockUser: Users = {
      name: 'John',
      lastName: 'Doe',
      password: 'Password1!',
      email: 'john.doe@example.com',
      idDocument: 123456789,
      phone: '+12345678901',
      birthdate: '2000-01-01',
      rol: 1,
    };

    service.saveUsers(mockUser, mockUser.lastName, mockUser.password, mockUser.email, mockUser.idDocument, mockUser.phone, mockUser.birthdate, mockUser.rol)
      .subscribe((response) => {
        expect(response).toEqual(mockUser);
      });

    const req = httpTestingController.expectOne('http://localhost:8081/users/register_aux_bodega');
    expect(req.request.method).toEqual('POST');
    expect(req.request.headers.get(APP_CONSTANTS.SAVE.TYPE)).toEqual(APP_CONSTANTS.SAVE.JSON);
    req.flush(mockUser);
  });

  it('should handle errors when save users fails', () => {
    const mockUser: Users = {
      name: 'John',
      lastName: 'Doe',
      password: 'Password1!',
      email: 'john.doe@example.com',
      idDocument: 123456789,
      phone: '+12345678901',
      birthdate: '2000-01-01',
      rol: 1,
    };

    service.saveUsers(mockUser, mockUser.lastName, mockUser.password, mockUser.email, mockUser.idDocument, mockUser.phone, mockUser.birthdate, mockUser.rol)
      .subscribe({
        next: () => fail('should have failed with a 500 error'),
        error: (error) => {
          expect(error.status).toEqual(500);
        },
      });

    const req = httpTestingController.expectOne('http://localhost:8081/users/register_aux_bodega');
    expect(req.request.method).toEqual('POST');
    req.flush('Internal server error', { status: 500, statusText: 'Server Error' });
  });
});
