import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrandCreateComponent } from './brand-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrandService } from '../../../services/brand.service';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { APP_CONSTANTS } from '@/styles/constants';
import { HttpStatusCode } from '@angular/common/http';

describe('BrandCreateComponent', () => {
  let component: BrandCreateComponent;
  let fixture: ComponentFixture<BrandCreateComponent>;
  let brandService: jest.Mocked<BrandService>;
  let toastrService: jest.Mocked<ToastrService>;

  beforeEach(async () => {
    const brandServiceMock = {
      saveBrand: jest.fn(),
    };

    const toastrServiceMock = {
      success: jest.fn(),
      error: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [BrandCreateComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: BrandService, useValue: brandServiceMock },
        { provide: ToastrService, useValue: toastrServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BrandCreateComponent);
    component = fixture.componentInstance;
    brandService = TestBed.inject(BrandService) as jest.Mocked<BrandService>;
    toastrService = TestBed.inject(ToastrService) as jest.Mocked<ToastrService>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty controls', () => {
    expect(component.brandForm).toBeTruthy();
    expect(component.brandForm.get('name')?.value).toBe('');
    expect(component.brandForm.get('description')?.value).toBe('');
  });

  it('should set status to error and show toastr error if form is invalid', () => {
    component.brandForm.get('name')?.setValue('');
    component.saveBrand();

    expect(component.status).toBe(APP_CONSTANTS.ERROR);
    expect(toastrService.error).toHaveBeenCalledWith(APP_CONSTANTS.ERRORS.CORRECT);
  });

  it('should call saveBrand on the BrandService if form is valid', () => {
    component.brandForm.get('name')?.setValue('Test Brand');
    component.brandForm.get('description')?.setValue('Test Description');

    brandService.saveBrand.mockReturnValue(of({ id: 1, name: 'Test Brand', description: 'Test Description' }));
    component.saveBrand();

    expect(brandService.saveBrand).toHaveBeenCalledWith({
      name: 'Test Brand',
      description: 'Test Description'
    });
    expect(toastrService.success).toHaveBeenCalledWith('Marca creada con éxito.');
    expect(component.status).toBe(APP_CONSTANTS.ERRORS.SUCCESS);
  });

  it('should handle error response when saving brand', () => {
    component.brandForm.get('name')?.setValue('Test Brand');
    component.brandForm.get('description')?.setValue('Test Description');

    const errorResponse = {
      status: 409,
      error: { message: 'Brand already exists' }
    };
    brandService.saveBrand.mockReturnValue(throwError(() => errorResponse));

    component.saveBrand();

    expect(brandService.saveBrand).toHaveBeenCalled();
    expect(component.status).toBe(APP_CONSTANTS.ERROR);
    expect(toastrService.error).toHaveBeenCalledWith(APP_CONSTANTS.ERRORS.USE);
  });

  it('should reset the form after successful save', () => {
    component.brandForm.get('name')?.setValue('Test Brand');
    component.brandForm.get('description')?.setValue('Test Description');

    brandService.saveBrand.mockReturnValue(of({ id: 1, name: 'Test Brand', description: 'Test Description' }));
    component.saveBrand();

    expect(component.brandForm.get('name')?.value);
    expect(component.brandForm.get('description')?.value);
  });

  it('should handle form invalid state and show correct error toastr', () => {
    component.brandForm.get('name')?.setValue('');
    component.brandForm.get('description')?.setValue('');

    component.saveBrand();

    expect(component.status).toBe(APP_CONSTANTS.ERROR);
    expect(component.errorMessage).toBe(APP_CONSTANTS.ERRORS.CORRECT);

    expect(toastrService.error).toHaveBeenCalledWith(APP_CONSTANTS.ERRORS.CORRECT);

    expect(brandService.saveBrand).not.toHaveBeenCalled();
  });

  it('should handle InternalServerError and show appropriate error message', () => {
    component.brandForm.get('name')?.setValue('Test Brand');
    component.brandForm.get('description')?.setValue('Test Description');

    const errorResponse = {
      status: HttpStatusCode.InternalServerError,
      error: { message: 'Server error' }
    };

    brandService.saveBrand.mockReturnValue(throwError(() => errorResponse));

    component.saveBrand();

    expect(component.status).toBe(APP_CONSTANTS.ERROR);
    expect(component.errorMessage).toBe(APP_CONSTANTS.ERRORS.DATA);
    expect(toastrService.error).toHaveBeenCalledWith(APP_CONSTANTS.ERRORS.DATA);
  });

  it('should handle InternalServerError with no error message and show default error message', () => {
    component.brandForm.get('name')?.setValue('Test Brand');
    component.brandForm.get('description')?.setValue('Test Description');

    const errorResponse = {
      status: HttpStatusCode.InternalServerError,
      error: {}
    };

    brandService.saveBrand.mockReturnValue(throwError(() => errorResponse));

    component.saveBrand();

    expect(component.status).toBe(APP_CONSTANTS.ERROR);
    expect(component.errorMessage).toBe(APP_CONSTANTS.ERRORS.OCCURRED);
    expect(toastrService.error).toHaveBeenCalledWith(APP_CONSTANTS.ERRORS.OCCURRED);
  });

  it('should reset status after timeout and clear any existing timeout', (() => {
    component.statusTimeout = setTimeout(() => {}, 1000);
    jest.spyOn(window, 'clearTimeout');  
    jest.useFakeTimers();  
  
    component.resetStatusAfterTimeout();
    expect(clearTimeout);

    jest.advanceTimersByTime(APP_CONSTANTS.NUMBER.TIMEOUT_MS);
    expect(component.status).toBe('');
    jest.useRealTimers(); 
  }));

});
