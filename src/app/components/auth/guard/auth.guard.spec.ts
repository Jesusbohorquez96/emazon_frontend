import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';
import { LoginService } from '../service/login.service';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let mockRouter: jest.Mocked<Router>;
  let mockLoginService: jest.Mocked<LoginService>;

  beforeEach(() => {
    const routerMock = {
      navigate: jest.fn()
    };

    const loginServiceMock = {
      isAuthenticated: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: routerMock },
        { provide: LoginService, useValue: loginServiceMock }
      ]
    });

    authGuard = TestBed.inject(AuthGuard);
    mockRouter = TestBed.inject(Router) as jest.Mocked<Router>;
    mockLoginService = TestBed.inject(LoginService) as jest.Mocked<LoginService>;
  });

  it('should allow activation if user is authenticated', () => {
    mockLoginService.isAuthenticated.mockReturnValue(true);
    const result = authGuard.canActivate();
    expect(result).toBe(true);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to /login if user is not authenticated', () => {
    mockLoginService.isAuthenticated.mockReturnValue(false);
    const result = authGuard.canActivate();
    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
