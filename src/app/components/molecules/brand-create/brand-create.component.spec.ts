import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrandCreateComponent } from './brand-create.component';
import { BrandService } from '../../../services/brand.service';
import { of, throwError } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';

describe('BrandCreateComponent', () => {
  let component: BrandCreateComponent;
  let fixture: ComponentFixture<BrandCreateComponent>;
  let brandService: BrandService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BrandCreateComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [BrandService]
    }).compileComponents();

    fixture = TestBed.createComponent(BrandCreateComponent);
    component = fixture.componentInstance;
    brandService = TestBed.inject(BrandService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.brandForm).toBeDefined();
    expect(component.brandForm.get('name')?.value).toBe('');
    expect(component.brandForm.get('description')?.value).toBe('');
  });

  it('should show an error message if form is invalid', () => {
    component.brandForm.get('name')?.setValue('');
    component.saveBrand();
    expect(component.status).toBe('error');
    expect(component.errorMessage).toBe('Corrige los errores del formulario.');
  });

  it('should call the saveBrand method of the service on valid form submission', () => {
    const spySaveBrand = jest.spyOn(brandService, 'saveBrand').mockReturnValue(of({ id: 1, name: 'Test Brand', description: 'Test Description' }));
    component.brandForm.get('name')?.setValue('Test Brand');
    component.brandForm.get('description')?.setValue('Test Description');
    
    component.saveBrand();

    expect(spySaveBrand).toHaveBeenCalled();
    expect(component.status).toBe('success');
  });

  it('should handle server error 500', () => {
    const errorResponse = {
      status: HttpStatusCode.InternalServerError,
      error: { message: 'Server error' }
    };

    jest.spyOn(brandService, 'saveBrand').mockReturnValue(throwError(() => errorResponse));

    component.brandForm.get('name')?.setValue('Test Brand');
    component.brandForm.get('description')?.setValue('Test Description');
    
    component.saveBrand();

    expect(component.status).toBe('error');
    expect(component.errorMessage).toBe('Error en los datos ingresados.');
  });

  it('should handle conflict error 409', () => {
    const errorResponse = { status: HttpStatusCode.Conflict };

    jest.spyOn(brandService, 'saveBrand').mockReturnValue(throwError(() => errorResponse));

    component.brandForm.get('name')?.setValue('Test Brand');
    component.brandForm.get('description')?.setValue('Test Description');
    
    component.saveBrand();

    expect(component.status).toBe('error');
    expect(component.errorMessage).toBe('Nombre ya en uso, elige otro.');
  });

  it('should call resetStatusAfterTimeout after error', () => {
    jest.spyOn(component, 'resetStatusAfterTimeout');
    
    component.brandForm.get('name')?.setValue('');
    component.saveBrand();
    
    expect(component.resetStatusAfterTimeout).toHaveBeenCalled();
  });

  it('should reset status after timeout', fakeAsync(() => {
    component.status = 'error';
    component.resetStatusAfterTimeout();
    tick(5000); 
    expect(component.status).toBe('');
  }));

  it('should handle undefined brandForm', () => {
    component.brandForm = undefined as any; 
    component.saveBrand();
  
    expect(component.status);
    expect(component.errorMessage);
  });

  it('should clear the timeout when resetting status', () => {
    const spyClearTimeout = jest.spyOn(global, 'clearTimeout');
  
    component.statusTimeout = setTimeout(() => {}, 5000);
  
    component.resetStatusAfterTimeout();
    expect(spyClearTimeout);
  });

});
