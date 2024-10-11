import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CategoryCreateComponent } from './category-create.component';
import { CategoryService } from '../../../services/category.service';
import { of, throwError } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';

describe('CategoryCreateComponent', () => {
  let component: CategoryCreateComponent;
  let fixture: ComponentFixture<CategoryCreateComponent>;
  let categoryService: CategoryService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoryCreateComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [CategoryService]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryCreateComponent);
    component = fixture.componentInstance;
    categoryService = TestBed.inject(CategoryService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.categoryForm).toBeDefined();
    expect(component.categoryForm.get('name')?.value).toBe('');
    expect(component.categoryForm.get('description')?.value).toBe('');
  });

  it('should show an error message if form is invalid', () => {
    component.categoryForm.get('name')?.setValue('');
    component.saveCategory();
    expect(component.status).toBe('error');
    expect(component.errorMessage).toBe('Corrige los errores del formulario.');
  });

  it('should call the saveCategory method of the service on valid form submission', () => {
    const spySaveCategory = jest.spyOn(categoryService, 'saveCategory').mockReturnValue(of({ id: 1, name: 'Test Category', description: 'Test Description' }));
    component.categoryForm.get('name')?.setValue('Test Category');
    component.categoryForm.get('description')?.setValue('Test Description');
    
    component.saveCategory();

    expect(spySaveCategory).toHaveBeenCalled();
    expect(component.status).toBe('success');
  });

  it('should handle server error 500', () => {
    const errorResponse = {
      status: HttpStatusCode.InternalServerError,
      error: { message: 'Server error' }
    };

    jest.spyOn(categoryService, 'saveCategory').mockReturnValue(throwError(() => errorResponse));

    component.categoryForm.get('name')?.setValue('Test Category');
    component.categoryForm.get('description')?.setValue('Test Description');
    
    component.saveCategory();

    expect(component.status).toBe('error');
    expect(component.errorMessage).toBe('Error en los datos ingresados.');
  });

  it('should handle conflict error 409', () => {
    const errorResponse = { status: HttpStatusCode.Conflict };

    jest.spyOn(categoryService, 'saveCategory').mockReturnValue(throwError(() => errorResponse));

    component.categoryForm.get('name')?.setValue('Test Category');
    component.categoryForm.get('description')?.setValue('Test Description');
    
    component.saveCategory();

    expect(component.status).toBe('error');
    expect(component.errorMessage).toBe('Nombre ya en uso, elige otro.');
  });

  it('should call resetStatusAfterTimeout after error', () => {
    jest.spyOn(component, 'resetStatusAfterTimeout');
    
    component.categoryForm.get('name')?.setValue('');
    component.saveCategory();
    
    expect(component.resetStatusAfterTimeout).toHaveBeenCalled();
  });

  it('should reset status after timeout', fakeAsync(() => {
    component.status = 'error';
    component.resetStatusAfterTimeout();
    tick(5000); 
    expect(component.status).toBe('');
  }));

  it('should show an error message if form is invalid', () => {
    component.categoryForm.get('name')?.setValue('');
    component.saveCategory();
    expect(component.status).toBe('error');
    expect(component.errorMessage).toBe('Corrige los errores del formulario.');
  });

  it('should call the saveCategory method of the service when the form is valid', () => {
    const spySaveCategory = jest.spyOn(categoryService, 'saveCategory').mockReturnValue(of({ id: 1, name: 'Test Category', description: 'Test Description' }));
    component.categoryForm.get('name')?.setValue('Test Category');
    component.categoryForm.get('description')?.setValue('Test Description');
  
    component.saveCategory();
  
    expect(spySaveCategory).toHaveBeenCalled();
    expect(component.status).toBe('success');
  });

  it('should show error message when form is invalid', () => {
    component.categoryForm.get('name')?.setValue(''); 
    component.categoryForm.get('description')?.setValue('Test description');
  
    component.saveCategory();
  
    expect(component.status).toBe('error');
    expect(component.errorMessage).toBe('Corrige los errores del formulario.');
  });

  it('should not show error message when form is valid', () => {
    component.categoryForm.get('name')?.setValue('Valid Name');
    component.categoryForm.get('description')?.setValue('Valid description');
  
    const spySaveCategory = jest.spyOn(categoryService, 'saveCategory').mockReturnValue(of({ id: 1, name: 'Valid Name', description: 'Valid description' }));
    component.saveCategory();
  
    expect(component.status).toBe('success');
    expect(component.errorMessage).toBe('');
    expect(spySaveCategory).toHaveBeenCalled();
  });

  it('should handle undefined categoryForm', () => {
    component.categoryForm = undefined as any; 
    component.saveCategory();
  
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
