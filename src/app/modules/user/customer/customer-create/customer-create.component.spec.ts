import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CustomerCreateComponent } from './customer-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CustomerService } from '@/app/services/customer.service';
import { of, throwError } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';
import { APP_CONSTANTS } from '@/styles/constants';

describe('CustomerCreateComponent', () => {
  let component: CustomerCreateComponent;
  let fixture: ComponentFixture<CustomerCreateComponent>;
  let mockCustomerService: any;
  let mockToastr: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockCustomerService = {
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
      declarations: [CustomerCreateComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: CustomerService, useValue: mockCustomerService },
        { provide: ToastrService, useValue: mockToastr },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerCreateComponent);
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
    component.saveCustomer();

    expect(component.status).toBe('error');
    expect(component.errorMessage).toBe('Corrige los errores del formulario.');
    expect(mockToastr.error).toHaveBeenCalledWith('Corrige los errores del formulario.');
    expect(mockCustomerService.saveUsers).not.toHaveBeenCalled();
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

  it('should reset status and errorMessage after timeout', (() => {
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

  it('should show success message and navigate to login after successful save', () => {
    const mockResponse = { success: true };
    mockCustomerService.saveUsers.mockReturnValue(of(mockResponse));
  
    component.registerForm.controls['name'].setValue('John');
    component.registerForm.controls['lastName'].setValue('Doe');
    component.registerForm.controls['email'].setValue('john.doe@example.com');
    component.registerForm.controls['password'].setValue('Password@123');
    component.registerForm.controls['idDocument'].setValue('12345678');
    component.registerForm.controls['phone'].setValue('+123456789');
    component.registerForm.controls['birthdate'].setValue('1990-01-01');
  
    component.saveCustomer();
  
    expect(component.status).toBe('success');
    expect(mockToastr.success).toHaveBeenCalledWith('Cliente registrado con éxito.');
    expect(mockRouter.navigate).toHaveBeenCalledWith([APP_CONSTANTS.lOGIN]);
    expect(component.registerForm.pristine).toBe(true); 
  });

  it('should handle generic error in saveCustomer and show default error message', () => {
    const genericErrorResponse = { status: HttpStatusCode.BadRequest };
    mockCustomerService.saveUsers.mockReturnValue(throwError(genericErrorResponse));
  
    component.registerForm.controls['name'].setValue('John');
    component.registerForm.controls['lastName'].setValue('Doe');
    component.registerForm.controls['email'].setValue('john.doe@example.com');
    component.registerForm.controls['password'].setValue('Password@123');
    component.registerForm.controls['idDocument'].setValue('12345678');
    component.registerForm.controls['phone'].setValue('+123456789');
    component.registerForm.controls['birthdate'].setValue('1990-01-01');
  
    component.saveCustomer();
  
    expect(component.status).toBe('error');
    expect(mockToastr.error).toHaveBeenCalledWith('Ocurrió un error al registrar el cliente.');
  });

  it('should display required validation message when name is empty', () => {
    component.registerForm.controls['name'].setValue('');
    component.registerForm.controls['name'].markAsTouched();
  
    fixture.detectChanges();
    expect(component.registerForm.controls['name'].errors?.['required']).toBeTruthy();
  });

  it('should display pattern validation message for invalid phone format', () => {
    component.registerForm.controls['phone'].setValue('12345');
    component.registerForm.controls['phone'].markAsTouched();
  
    fixture.detectChanges();
    expect(component.registerForm.controls['phone'].errors?.['pattern']).toBeTruthy();
  });

  it('should show "Error interno del servidor" for InternalServerError', () => {
    const errorResponse = { status: HttpStatusCode.InternalServerError };
    mockCustomerService.saveUsers.mockReturnValue(throwError(errorResponse));
  
    component.registerForm.controls['name'].setValue('John');
    component.registerForm.controls['lastName'].setValue('Doe');
    component.registerForm.controls['email'].setValue('john@gmail.com');
    component.registerForm.controls['password'].setValue('Password@123');
    component.registerForm.controls['idDocument'].setValue('12345678');
    component.registerForm.controls['phone'].setValue('+123456789');
    component.registerForm.controls['birthdate'].setValue('1990-01-01');

    component.saveCustomer();

    expect(component.status).toBe('error');
    expect(component.errorMessage).toBe('Error interno del servidor.');
  });

  it('should show "El nombre de usuario ya está en uso" for Conflict', () => {
    const errorResponse = { status: HttpStatusCode.Conflict };
    mockCustomerService.saveUsers.mockReturnValue(throwError(errorResponse));
  
    component.registerForm.controls['name'].setValue('John');
    component.registerForm.controls['lastName'].setValue('Doe');
    component.registerForm.controls['email'].setValue('john@gmail.com');
    component.registerForm.controls['password'].setValue('Password@123');
    component.registerForm.controls['idDocument'].setValue('12345678');
    component.registerForm.controls['phone'].setValue('+123456789');
    component.registerForm.controls['birthdate'].setValue('1990-01-01');

    component.saveCustomer();

    expect(component.status).toBe('error');
    expect(component.errorMessage).toBe('El nombre de usuario ya está en uso.');
  });
});
