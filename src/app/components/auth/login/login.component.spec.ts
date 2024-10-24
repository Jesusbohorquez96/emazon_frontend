import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoginService } from '../service/login.service';
import { of, throwError } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';
import { APP_CONSTANTS } from '@/styles/constants';
import { LoginComponent } from './login.component';
import { VisibilityService } from '@/app/services/visibility.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockVisibilityService: any;
  let mockLoginService: any;
  let mockToastr: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockLoginService = {
      saveLogin: jest.fn()
    };

    mockToastr = {
      success: jest.fn(),
      error: jest.fn()
    };

    mockRouter = {
      navigate: jest.fn()
    };

    mockVisibilityService = {
      hideNavbar: jest.fn(),
      hideFooter: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: LoginService, useValue: mockLoginService },
        { provide: ToastrService, useValue: mockToastr },
        { provide: Router, useValue: mockRouter },
        { provide: VisibilityService, useValue: mockVisibilityService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should hide navbar and footer on init', () => {
    component.ngOnInit();
    expect(mockVisibilityService.hideNavbar).toHaveBeenCalled();
    expect(mockVisibilityService.hideFooter).toHaveBeenCalled();
  });

  it('should show error message if form is invalid', () => {
    component.loginForm.controls['email'].setValue('');
    component.loginForm.controls['password'].setValue('');

    component.saveLogin();

    expect(component.status).toBe(APP_CONSTANTS.ERROR);
    expect(component.errorMessage).toBe(APP_CONSTANTS.ERRORS.CORRECT);
    expect(mockToastr.error).toHaveBeenCalledWith(APP_CONSTANTS.ERRORS.CORRECT);
    expect(mockLoginService.saveLogin).not.toHaveBeenCalled();  
  });

  it('should handle login successfully and navigate to home', () => {
    const mockResponse = { token: 'fakeToken', user: { id: 1, name: 'Test User' } };
    mockLoginService.saveLogin.mockReturnValue(of(mockResponse));

    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('Password@123');
    
    component.saveLogin();

    expect(mockLoginService.saveLogin).toHaveBeenCalledWith('test@example.com', 'Password@123');
    expect(localStorage.setItem);
    expect(localStorage.setItem);
    expect(mockToastr.success);
    expect(mockRouter.navigate);
  });

  it('should reset the form when resetForm is called', () => {
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('Password@123');

    component.resetForm();

    expect(component.loginForm.pristine);
    expect(component.loginForm.untouched);
    expect(component.loginForm.value)
  });

  it('should handle saveLogin error for HttpStatusCode.Conflict', () => {
    const conflictErrorResponse = { status: HttpStatusCode.Conflict };
    mockLoginService.saveLogin.mockReturnValue(throwError(conflictErrorResponse));

    component.loginForm.controls['email'].setValue('john.doe@example.com');
    component.loginForm.controls['password'].setValue('Password@123');

    component.saveLogin();

    expect(component.status).toBe(APP_CONSTANTS.ERROR);
    expect(mockToastr.error).toHaveBeenCalledWith(APP_CONSTANTS.ERRORS.OCCURRED);
  });

  it('should clear existing timeout, set a new one, and reset status and errorMessage after timeout', fakeAsync(() => {
    jest.useFakeTimers();
    const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');
    const setTimeoutSpy = jest.spyOn(window, 'setTimeout');
  
    component.status = 'some status';
    component.errorMessage = 'some error';
    component.statusTimeout = setTimeout(() => {}, 1000);  

    component.resetStatusAfterTimeout();
  
    expect(clearTimeoutSpy);
    expect(setTimeoutSpy);

    jest.runAllTimers(); 

    expect(component.status).toBe('');  
    expect(component.errorMessage).toBe('');
  }));

  it('should navigate to /auxbodega when goToRegister is called', () => {
    component.goToRegister();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auxbodega']);
  });


  it('sould errorMessage "error en el servidor. por favor intente mas tarde" when saveLogin is called and return error', () => {
    const errorResponse = { status: HttpStatusCode.InternalServerError };
    mockLoginService.saveLogin.mockReturnValue(throwError(errorResponse));

    component.loginForm.controls['email'].setValue('john.doe@example.com');
    component.loginForm.controls['password'].setValue('Password@123');

    expect(component.status).toBe('');
    expect(component.errorMessage).toBe('');

    component.saveLogin();

    expect(component.status).toBe(APP_CONSTANTS.ERROR);
    expect(component.errorMessage);
  });

  it('sould errorMessage "error en el servidor. por favor intente mas tarde" when saveLogin is called and return error', () => {
    const errorResponse = { status: HttpStatusCode.Unauthorized };
    mockLoginService.saveLogin.mockReturnValue(throwError(errorResponse));

    component.loginForm.controls['email'].setValue('john.doe@example.com');
    component.loginForm.controls['password'].setValue('Password@123');

    expect(component.status).toBe('');
    expect(component.errorMessage).toBe('');

    component.saveLogin();

    expect(component.status).toBe(APP_CONSTANTS.ERROR);
    expect(component.errorMessage);
  });
});
