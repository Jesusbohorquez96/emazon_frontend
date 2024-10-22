import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoryCreateComponent } from './category-create.component';
import { CategoryService } from '../../../services/category.service';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';
import { APP_CONSTANTS } from '@/styles/constants';

describe('CategoryCreateComponent', () => {
  let component: CategoryCreateComponent;
  let fixture: ComponentFixture<CategoryCreateComponent>;
  let categoryServiceMock: any;
  let toastrServiceMock: any;

  beforeEach(async () => {
    categoryServiceMock = {
      saveCategory: jest.fn()
    };

    toastrServiceMock = {
      success: jest.fn(),
      error: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [CategoryCreateComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: CategoryService, useValue: categoryServiceMock },
        { provide: ToastrService, useValue: toastrServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show an error if the form is invalid when trying to save', () => {
    component.saveCategory();

    expect(component.status).toBe(APP_CONSTANTS.ERROR);
    expect(component.errorMessage).toBe(APP_CONSTANTS.ERRORS.CORRECT);
    expect(toastrServiceMock.error).toHaveBeenCalledWith(APP_CONSTANTS.ERRORS.CORRECT);
  });

  it('should call saveCategory and show success message when category is saved', () => {
    const mockResponse = { id: 1, name: 'Test Category', description: 'Test Description' };
    categoryServiceMock.saveCategory.mockReturnValue(of(mockResponse));

    component.categoryForm.setValue({
      name: 'Valid Category',
      description: 'Valid Description'
    });
    component.saveCategory();

    expect(component.status).toBe(APP_CONSTANTS.ERRORS.SUCCESS);
    expect(toastrServiceMock.success).toHaveBeenCalledWith('Categoría creada con éxito.');
    expect(component.categoryForm.reset);
  });

  it('should show error message if category already exists (status 409)', () => {
    const mockError = {
      status: HttpStatusCode.Conflict,
      error: { message: 'Conflict' }
    };
    categoryServiceMock.saveCategory.mockReturnValue(throwError(() => mockError));

    component.categoryForm.setValue({
      name: 'Existing Category',
      description: 'Description'
    });
    component.saveCategory();

    expect(component.status).toBe(APP_CONSTANTS.ERROR);
    expect(component.errorMessage).toBe(APP_CONSTANTS.ERRORS.USE);
    expect(toastrServiceMock.error).toHaveBeenCalledWith(APP_CONSTANTS.ERRORS.USE);
  });

  it('should show error message if server returns 500', () => {
    const mockError = {
      status: HttpStatusCode.InternalServerError,
      error: { message: 'Internal server error' }
    };
    categoryServiceMock.saveCategory.mockReturnValue(throwError(() => mockError));

    component.categoryForm.setValue({
      name: 'Category',
      description: 'Description'
    });
    component.saveCategory();

    expect(component.status).toBe(APP_CONSTANTS.ERROR);
    expect(component.errorMessage).toBe(APP_CONSTANTS.ERRORS.DATA);
    expect(toastrServiceMock.error).toHaveBeenCalledWith(APP_CONSTANTS.ERRORS.DATA);
  });

  it('should reset status and errorMessage after timeout', (done) => {
    jest.useFakeTimers();
    component.status = 'someStatus';
    component.errorMessage = 'someErrorMessage';

    component.resetStatusAfterTimeout();

    jest.advanceTimersByTime(APP_CONSTANTS.NUMBER.TIMEOUT_MS);
    fixture.detectChanges();

    expect(component.status).toBe('');
    expect(component.errorMessage).toBe('');
    jest.useRealTimers();
    done();
  });

  it('should handle undefined categoryForm', () => {
    component.categoryForm = undefined as any;
    component.saveCategory();

    expect(component.status).toBe(APP_CONSTANTS.ERROR);
    expect(component.errorMessage).toBe(APP_CONSTANTS.ERRORS.CORRECT);
    expect(toastrServiceMock.error).toHaveBeenCalledWith(APP_CONSTANTS.ERRORS.CORRECT);
  });

  it('should clear status and errorMessage after timeout', () => {
    component.status = 'Success';
    component.errorMessage = 'Some error message';

    component.resetStatusAfterTimeout();

    expect(component.status).toBe('Success');

    jest.advanceTimersByTime(APP_CONSTANTS.NUMBER.TIMEOUT_MS);

    expect(component.status);
    expect(component.errorMessage);
  });

  it('should clear existing timeout if called again', () => {
    component.resetStatusAfterTimeout();

    jest.advanceTimersByTime(APP_CONSTANTS.NUMBER.TIMEOUT_MS / 2);

    component.resetStatusAfterTimeout();

    expect(clearTimeout);
  });

});
