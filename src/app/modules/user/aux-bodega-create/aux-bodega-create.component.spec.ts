import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AuxBodegaCreateComponent } from './aux-bodega-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { auxBodegaService } from '@/app/services/aux-bodega.service';
import { fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';

describe('AuxBodegaCreateComponent', () => {
  let component: AuxBodegaCreateComponent;
  let fixture: ComponentFixture<AuxBodegaCreateComponent>;
  let mockAuxBodegaService: any;
  let mockToastr: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockAuxBodegaService = {
      saveUsers: jest.fn()
    };

    mockToastr = {
      success: jest.fn(),
      error: jest.fn()
    };

    mockRouter = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [AuxBodegaCreateComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: auxBodegaService, useValue: mockAuxBodegaService },
        { provide: ToastrService, useValue: mockToastr },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuxBodegaCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.ngOnInit();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should prevent input when character is not a number', () => {
    const event = new KeyboardEvent('keypress', { charCode: 65 });
    jest.spyOn(event, 'preventDefault');
    component.validateNumberInput(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should allow only numeric characters and "+"', () => {
    const numericEvent = new KeyboardEvent('keypress', { charCode: 50 });
    const plusEvent = new KeyboardEvent('keypress', { charCode: 43 });
    const letterEvent = new KeyboardEvent('keypress', { charCode: 65 });

    expect(component.allowOnlyNumbers(numericEvent)).toBe(true);
    expect(component.allowOnlyNumbers(plusEvent)).toBe(true);
    expect(component.allowOnlyNumbers(letterEvent)).toBe(false);
  });

  it('should show error message and return if form is invalid', () => {
    component.registerForm.controls['name'].setValue('');
    component.saveUsers();

    expect(component.status).toBe('error');
    expect(component.errorMessage).toBe('Corrige los errores del formulario.');
    expect(mockToastr.error).toHaveBeenCalledWith('Corrige los errores del formulario.');
    expect(mockAuxBodegaService.saveUsers).not.toHaveBeenCalled();
  });

  it('should reset the form when resetForm is called', () => {
    component.registerForm.controls['name'].setValue('John');
    component.registerForm.controls['lastName'].setValue('Doe');
    component.registerForm.controls['email'].setValue('john.doe@example.com');

    component.resetForm();

    expect(component.registerForm.pristine).toBe(true);
    expect(component.registerForm.untouched).toBe(true);
    expect(component.registerForm.value).toEqual({
      birthdate: null,
      email: null,
      idDocument: null,
      lastName: null,
      name: null,
      password: null,
      phone: null,
      rol: null,
    });
  });

  it('should clear existing timeout if statusTimeout is already set', () => {
    const mockTimeout = setTimeout(() => { }, 1000);
    component.statusTimeout = mockTimeout;
    jest.spyOn(window, 'clearTimeout');

    component.resetStatusAfterTimeout();

    expect(clearTimeout).toHaveBeenCalledWith(mockTimeout);
  });

  it('should navigate to /login when goToLogin is called', () => {
    component.goToLogin();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show success message when saving users is successful', () => {
    const mockResponse = { success: true };
    mockAuxBodegaService.saveUsers.mockReturnValue(of(mockResponse));

    component.registerForm.controls['name'].setValue('John');
    component.registerForm.controls['lastName'].setValue('Doe');
    component.registerForm.controls['email'].setValue('john.doe@example.com');
    component.registerForm.controls['password'].setValue('Password@123');
    component.registerForm.controls['idDocument'].setValue('12345678');
    component.registerForm.controls['phone'].setValue('+123456789');
    component.registerForm.controls['birthdate'].setValue('1990-01-01');
    component.registerForm.controls['rol'].setValue('admin');

    component.saveUsers();

    expect(component.status);
    expect(mockToastr.success);
    expect(mockRouter.navigate);
  });

  it('should handle saveUsers error for HttpStatusCode.Conflict', () => {
    const conflictErrorResponse = { status: HttpStatusCode.Conflict };
    mockAuxBodegaService.saveUsers.mockReturnValue(throwError(conflictErrorResponse));

    component.registerForm.controls['name'].setValue('John');
    component.registerForm.controls['lastName'].setValue('Doe');
    component.registerForm.controls['email'].setValue('john.doe@example.com');
    component.registerForm.controls['password'].setValue('Password@123');
    component.registerForm.controls['idDocument'].setValue('12345678');
    component.registerForm.controls['phone'].setValue('+123456789');
    component.registerForm.controls['birthdate'].setValue('1990-01-01');
    component.registerForm.controls['rol'].setValue('admin');

    component.saveUsers();

    expect(component.status).toBe('error');
    expect(mockToastr.error).toHaveBeenCalledWith('Nombre ya en uso, elige otro.');
  });

  it('should handle InternalServerError and show "Usuario no autorizado" if error message is present', () => {
    const errorResponse = {
      status: HttpStatusCode.InternalServerError,
      error: { message: 'Not authorized' }
    };
    
    mockAuxBodegaService.saveUsers.mockReturnValue(throwError(errorResponse));
  
    component.registerForm.controls['name'].setValue('John');
    component.registerForm.controls['lastName'].setValue('Doe');
    component.registerForm.controls['email'].setValue('john.doe@example.com');
    component.registerForm.controls['password'].setValue('Password@123');
    component.registerForm.controls['idDocument'].setValue('12345678');
    component.registerForm.controls['phone'].setValue('+123456789');
    component.registerForm.controls['birthdate'].setValue('1990-01-01');
    component.registerForm.controls['rol'].setValue('admin');
  
    component.saveUsers();
  
    expect(component.status).toBe('error');
    expect(mockToastr.error).toHaveBeenCalledWith('Ususario no autorizado.');
  });

  it('should reset status and errorMessage after timeout', fakeAsync(() => {
    jest.useFakeTimers();
    component.status = 'error';
    component.errorMessage = 'Ocurrió un error';
    component.resetStatusAfterTimeout();
    jest.advanceTimersByTime(5000);
    expect(component.status).toBe('');
    expect(component.errorMessage).toBe('');
    jest.useRealTimers();
  }));

  it('should return null if the date corresponds to a person 18 years or older', () => {
    const control = { value: '2000-01-01' };  
    const result = component.dateValidator(control);
    
    expect(result).toBeNull();  
  });
  
  it('should return an error if the date corresponds to a person younger than 18', () => {
    const control = { value: '2010-01-01' };
    const result = component.dateValidator(control);
    
    expect(result).toEqual({ notAdult: true });  
  });
  
  it('should return null if the person is exactly 18 years old today', () => {
    const today = new Date();
    const control = { value: `${today.getFullYear() - 18}-${today.getMonth() + 1}-${today.getDate()}` };
    const result = component.dateValidator(control);
    
    expect(result).toBeNull(); 
  });
});
