import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginService } from './login.service';
import { APP_CONSTANTS } from '@/styles/constants';

describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoginService]
    });

    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verificamos que no haya solicitudes pendientes
    httpMock.verify();
  });

  it('should send a POST request to the login endpoint with correct body and headers', () => {
    const mockEmail = 'test@example.com';
    const mockPassword = 'password123';
    const mockResponse = { token: '123456' };  // Simulación de respuesta

    // Llamamos al método que estamos probando
    service.saveLogin(mockEmail, mockPassword).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    // Verificamos que se haya hecho la solicitud HTTP correcta
    const req = httpMock.expectOne(`${APP_CONSTANTS.API.USER_URL}${APP_CONSTANTS.API.LOGIN_ENDPOINT}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: mockEmail, password: mockPassword });

    // Verificamos los encabezados
    expect(req.request.headers.get('Content-Type')).toBe('application/json');

    // Simulamos la respuesta del servidor
    req.flush(mockResponse);
  });
});
