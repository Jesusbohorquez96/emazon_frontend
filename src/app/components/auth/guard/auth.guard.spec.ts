import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginService } from '../service/login.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let mockLoginService: any;
  let mockRouter: any;

  beforeEach(() => {
    mockLoginService = {
      isAuthenticated: jest.fn(),
    };

    mockRouter = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: LoginService, useValue: mockLoginService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation if the user is authenticated', () => {
    mockLoginService.isAuthenticated.mockReturnValue(true);

    const canActivate = guard.canActivate();

    expect(canActivate).toBe(true);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should block activation and navigate to login if the user is not authenticated', () => {
    mockLoginService.isAuthenticated.mockReturnValue(false);

    const canActivate = guard.canActivate();

    expect(canActivate).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
