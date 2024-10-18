import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;
  let toastrService: jest.Mocked<ToastrService>;
  let buttonElement: DebugElement;

  beforeEach(async () => {
    const toastrServiceMock = {
      success: jest.fn(),
      error: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [ButtonComponent],
      providers: [
        { provide: ToastrService, useValue: toastrServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    toastrService = TestBed.inject(ToastrService) as jest.Mocked<ToastrService>;
    buttonElement = fixture.debugElement.query(By.css('button')); // Get the button element

    // Mock FormGroup with a valid form
    component.buttonForm = new FormGroup({
      testControl: new FormControl('', Validators.required)
    });

    fixture.detectChanges(); // trigger initial data binding
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show error toastr if form is invalid on click', () => {
    component.buttonForm.controls['testControl'].setValue(''); // invalidate form
    buttonElement.triggerEventHandler('click', null);

    expect(toastrService.error).toHaveBeenCalledWith('El formulario tiene errores. Por favor, revisa los campos.');
  });

  it('should show error toastr with custom message if status is "error" and errorMessage is provided', () => {
    component.status = 'error';
    component.errorMessage = 'Custom error message';
    component.buttonForm.controls['testControl'].setValue('Valid input'); // valid form

    buttonElement.triggerEventHandler('click', null);

    expect(toastrService.error).toHaveBeenCalledWith('Custom error message', '', {
      positionClass: 'toast-top-right'
    });
  });

  it('should show success toastr if status is "success"', () => {
    component.status = 'success';
    component.errorMessage = 'Success message';
    component.buttonForm.controls['testControl'].setValue('Valid input'); // valid form

    buttonElement.triggerEventHandler('click', null);

    expect(toastrService.success).toHaveBeenCalledWith('Success message', '', {
      positionClass: 'toast-top-right'
    });
  });

  it('should not call toastr if form is valid but no status is provided', () => {
    component.status = '';
    component.buttonForm.controls['testControl'].setValue('Valid input'); // valid form

    buttonElement.triggerEventHandler('click', null);

    expect(toastrService.error).not.toHaveBeenCalled();
    expect(toastrService.success).not.toHaveBeenCalled();
  });

  it('should disable the button when isDisabled is true', () => {
    component.isDisabled = true;
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.disabled).toBe(true);
  });

  it('should enable the button when isDisabled is false', () => {
    component.isDisabled = false;
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.disabled);
  });
});
