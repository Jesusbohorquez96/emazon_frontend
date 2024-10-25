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
      providers: [LoginService],
    });
    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call saveLogin with the correct URL and payload', () => {
    const email = 'test@example.com';
    const password = 'password123';
    const mockResponse = { success: true };

    service.saveLogin(email, password).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${APP_CONSTANTS.API.USER_URL}${APP_CONSTANTS.API.LOGIN_ENDPOINT}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email, password });
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    
    req.flush(mockResponse);
  });

  it('should return true if authToken is present in localStorage', () => {
    localStorage.setItem('authToken', 'testToken');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should return false if authToken is not present in localStorage', () => {
    localStorage.removeItem('authToken');
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should remove authToken from localStorage on logout', () => {
    localStorage.setItem('authToken', 'testToken');
    service.logout();
    expect(localStorage.getItem('authToken')).toBeNull();
  });
});
