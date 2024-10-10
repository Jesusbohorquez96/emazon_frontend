import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { CategoryComponent } from './category.component';
import { CategoryService } from '../services/category.service';
import { of, throwError } from 'rxjs';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpStatusCode } from '@angular/common/http';

const mockCategories = [
  { id: 1, name: 'Category 1', description: 'Description 1' },
  { id: 2, name: 'Category 2', description: 'Description 2' },
];

describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;
  let categoryService: CategoryService;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoryComponent],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
        {
          provide: CategoryService,
          useValue: {
            getCategories: jest.fn(() =>
              of({ content: mockCategories, totalPages: 2 })
            ),
            saveCategory: jest.fn(),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    categoryService
      = TestBed.inject(CategoryService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject CategoryService', () => {
    expect(categoryService).toBeTruthy();
  });

  it('should inject CategoryService', () => {
    expect(component['categoryService']).toBeTruthy();
  });

  it('should show error message on invalid form submission', () => {
    component.saveCategory();
    fixture.detectChanges();

    expect(component.status).toEqual('error');
    expect(component.errorMessage).toEqual('Corrige los errores del formulario.');
  });

  it('should load categories on init', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.categories.length).toBe(2);
    expect(component.categories[0].name).toEqual('Category 1');
  });

  it('should save category successfully', () => {
    component.categoryForm.setValue({
      name: 'New Category',
      description: 'New Description'
    });

  });

  it('should handle error when saving category fails', () => {
    component.categoryForm.setValue({
      name: 'New Category',
      description: 'New Description'
    });

    jest.spyOn(categoryService, 'saveCategory').mockReturnValue(throwError(() => new Error('Save failed')));

    component.saveCategory();
    fixture.detectChanges();

    expect(component.status).toEqual('error');
  });

  it('should change page when pageChange is called', () => {
    fixture.detectChanges();
  });

  it('should filter categories by name when search is performed', () => {
    component.searchName = 'Category 1';
    fixture.detectChanges();

    expect(component.categories[0].name).toEqual('Category 1');
  });

  it('should go to next page when nextPage is called', () => {
    component.page = 0;
    component.totalPages = 2;

    component.nextPage();
    fixture.detectChanges();

    expect(component.page).toBe(1);
    expect(categoryService.getCategories).toHaveBeenCalled();
  });

  it('should not go to next page if on the last page', () => {
    component.page = 1;
    component.totalPages = 2;

    component.nextPage();
    fixture.detectChanges();

    expect(component.page).toBe(1);
  });

  it('should go to previous page when prevPage is called', () => {
    component.page = 1;

    component.prevPage();
    fixture.detectChanges();

    expect(component.page).toBe(0);
    expect(categoryService.getCategories).toHaveBeenCalled();
  });

  it('should not go to previous page if on the first page', () => {
    component.page = 0;

    component.prevPage();
    fixture.detectChanges();

    expect(component.page).toBe(0);
  });

  it('should search by name when searchByName is called', () => {
    component.searchName = 'Category 1';

    component.searchByName();
    fixture.detectChanges();

    expect(component.page).toBe(0);
    expect(categoryService.getCategories).toHaveBeenCalled();
  });

  it('should update page size when updatePageSize is called', () => {
    component.size = 2;

    component.updatePageSize();
    fixture.detectChanges();

    expect(component.page).toBe(0);
    expect(categoryService.getCategories).toHaveBeenCalled();
  });

  it('should go to a specific page when goToPage is called', () => {
    component.totalPages = 3;

    component.goToPage(2);
    fixture.detectChanges();

    expect(component.page).toBe(2);
    expect(categoryService.getCategories).toHaveBeenCalled();
  });

  it('should not go to an invalid page when goToPage is called', () => {
    component.totalPages = 3;

    component.goToPage(3);
    fixture.detectChanges();

    expect(component.page).not.toBe(3);
  });

  it('should go to next page when nextPage is called', () => {
    component.page = 0;
    component.totalPages = 2;

    const spy = jest.spyOn(categoryService, 'getCategories').mockReturnValue(of({ content: mockCategories, totalPages: 2 }));

    component.nextPage();
    fixture.detectChanges();

    expect(component.page).toBe(1);
    expect(spy).toHaveBeenCalledWith(1, component.size, component.sortBy, component.sortDirection, component.searchName);
  });

  it('should search by name when searchByName is called', () => {
    component.searchName = 'Category 1';

    const spy = jest.spyOn(categoryService, 'getCategories').mockReturnValue(of({ content: mockCategories, totalPages: 2 }));

    component.searchByName();
    fixture.detectChanges();

    expect(component.page).toBe(0);
    expect(spy).toHaveBeenCalledWith(0, component.size, component.sortBy, component.sortDirection, 'Category 1');
  });

  it('should update page size when updatePageSize is called', () => {
    component.size = 2;

    const spy = jest.spyOn(categoryService, 'getCategories').mockReturnValue(of({ content: mockCategories, totalPages: 2 }));

    component.updatePageSize();
    fixture.detectChanges();

    expect(component.page).toBe(0);
    expect(spy).toHaveBeenCalledWith(0, 2, component.sortBy, component.sortDirection, component.searchName);
  });

  it('should update page size and reload categories', () => {
    component.size = 2;
    const spy = jest.spyOn(categoryService, 'getCategories').mockReturnValue(of({ content: mockCategories, totalPages: 2 }));

    component.updatePageSize();
    fixture.detectChanges();

    expect(component.page).toBe(0);
    expect(spy).toHaveBeenCalledWith(0, 2, component.sortBy, component.sortDirection, component.searchName);
  });

  it('should toggle the sort direction and reload categories', () => {
    component.sortDirection = 'ASC';
    const spy = jest.spyOn(categoryService, 'getCategories').mockReturnValue(of({ content: mockCategories, totalPages: 2 }));

    component.toggleSort();
    fixture.detectChanges();

    expect(component.sortDirection).toBe('DESC');
    expect(spy).toHaveBeenCalledWith(component.page, component.size, component.sortBy, 'DESC', component.searchName);

    component.toggleSort();
    fixture.detectChanges();

    expect(component.sortDirection).toBe('ASC');
  });

  it('should search categories by name and reset page', () => {
    component.searchName = 'Category 1';
    const spy = jest.spyOn(categoryService, 'getCategories').mockReturnValue(of({ content: mockCategories, totalPages: 2 }));

    component.searchByName();
    fixture.detectChanges();

    expect(component.page).toBe(0);
    expect(spy).toHaveBeenCalledWith(0, component.size, component.sortBy, component.sortDirection, 'Category 1');
  });

  it('should change page and reload categories', () => {
    const spy = jest.spyOn(categoryService, 'getCategories').mockReturnValue(of({ content: mockCategories, totalPages: 2 }));

    component.onPageChange(1);
    fixture.detectChanges();

    expect(component.page).toBe(1);
    expect(spy).toHaveBeenCalledWith(1, component.size, component.sortBy, component.sortDirection, component.searchName);
  });

  it('should go to a valid page and reload categories', () => {
    component.totalPages = 3;
    const spy = jest.spyOn(categoryService, 'getCategories').mockReturnValue(of({ content: mockCategories, totalPages: 2 }));

    component.goToPage(2);
    fixture.detectChanges();

    expect(component.page).toBe(2);
    expect(spy).toHaveBeenCalledWith(2, component.size, component.sortBy, component.sortDirection, component.searchName);
  });

  it('should not go to an invalid page', () => {
    component.totalPages = 3;

    component.goToPage(3);
    fixture.detectChanges();

    expect(component.page).not.toBe(3);
  });

  it('should go to next page', () => {
    component.page = 0;
    component.totalPages = 2;
    const spy = jest.spyOn(categoryService, 'getCategories').mockReturnValue(of({ content: mockCategories, totalPages: 2 }));

    component.nextPage();
    fixture.detectChanges();

    expect(component.page).toBe(1);
    expect(spy).toHaveBeenCalledWith(1, component.size, component.sortBy, component.sortDirection, component.searchName);
  });

  it('should not go to next page if on last page', () => {
    component.page = 1;
    component.totalPages = 2;

    component.nextPage();
    fixture.detectChanges();

    expect(component.page).toBe(1);
  });

  it('should go to previous page', () => {
    component.page = 1;
    const spy = jest.spyOn(categoryService, 'getCategories').mockReturnValue(of({ content: mockCategories, totalPages: 2 }));

    component.prevPage();
    fixture.detectChanges();

    expect(component.page).toBe(0);
    expect(spy).toHaveBeenCalledWith(0, component.size, component.sortBy, component.sortDirection, component.searchName);
  });

  it('should not go to previous page if on first page', () => {
    component.page = 0;

    component.prevPage();
    fixture.detectChanges();

    expect(component.page).toBe(0);
  });

  jest.useFakeTimers();

  it('should reset status after timeout', () => {
    component.status = 'success';
    component.resetStatusAfterTimeout();

    expect(component.status).toBe('success');

    jest.advanceTimersByTime(5000);
    fixture.detectChanges();

    expect(component.status).toBe('');
  });

  //TODO error pero funcionando 

  it('should handle error when getCategories fails', () => {
    const errorResponse = { status: 500, message: 'Internal Server Error' };

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

    jest.spyOn(categoryService, 'getCategories').mockReturnValue(throwError(() => errorResponse));

    component.getCategories();
    fixture.detectChanges();

    expect(consoleSpy).toHaveBeenCalledWith('Error al obtener las categorías:', errorResponse);

    consoleSpy.mockRestore();
  });

  it('should reset the form after saving category', () => {
    component.categoryForm.setValue({
      name: 'New Category',
      description: 'New Description'
    });

    jest.spyOn(categoryService, 'saveCategory').mockReturnValue(of({ id: 3, name: 'New Category', description: 'New Description' }));
    component.saveCategory();
    fixture.detectChanges();

    expect(component.categoryForm.value);
  });

  it('should handle conflict error when saving category', () => {
    const errorResponse = { status: HttpStatusCode.Conflict };
    jest.spyOn(categoryService, 'saveCategory').mockReturnValue(throwError(() => errorResponse));

    component.saveCategory();
    fixture.detectChanges();

    expect(component.status).toBe('error');
  });

  it('should set status to error if the form is invalid', () => {
    component.categoryForm.setValue({
      name: '',
      description: ''
    });

    component.saveCategory();
    fixture.detectChanges();

    expect(component.status).toBe('error');
    expect(component.errorMessage).toBe('Corrige los errores del formulario.');
    expect(categoryService.saveCategory).not.toHaveBeenCalled();
  });

  it('should go to a valid page', () => {
    component.totalPages = 5;
    component.goToPage(2);

    expect(component.page).toBe(2);
    expect(categoryService.getCategories).toHaveBeenCalled();
  });

  it('should not go to an invalid page', () => {
    component.totalPages = 5;

    component.goToPage(6);
    expect(component.page).not.toBe(6);

    component.goToPage(-1);
    expect(component.page).not.toBe(-1);
  });

  it('should go to a valid page', () => {
    component.totalPages = 5;

    component.goToPage(2);

    expect(component.page).toBe(2);
    expect(categoryService.getCategories).toHaveBeenCalled();
  });

  it('should not go to an invalid page', () => {
    component.totalPages = 5;

    component.goToPage(6);
    expect(component.page).not.toBe(6);

    component.goToPage(-1);
    expect(component.page).not.toBe(-1);
  });

  it('should not throw error if categoryForm is undefined when resetForm is called', () => {
    component.categoryForm = new FormGroup({});
    expect(() => component.resetForm()).not.toThrow();
  });

  it('should call getCategories when page is within valid range', () => {
    component.totalPages = 3;
    component.goToPage(2);

    expect(component.page).toBe(2);
    expect(categoryService.getCategories).toHaveBeenCalled();
  });

  it('should handle internal server error with detailed message when saving category', () => {
    const errorResponse = {
      status: HttpStatusCode.InternalServerError,
      error: { error: { message: 'Detailed error message' } }
    };

    jest.spyOn(categoryService, 'saveCategory').mockReturnValue(throwError(() => errorResponse));

    component.categoryForm.setValue({
      name: 'Category Name',
      description: 'Category Description'
    });

    component.saveCategory();
    fixture.detectChanges();

    expect(component.status).toBe('error');
  });

  it('should handle conflict error when saving category', () => {
    const errorResponse = { status: HttpStatusCode.Conflict };

    jest.spyOn(categoryService, 'saveCategory').mockReturnValue(throwError(() => errorResponse));

    component.categoryForm.setValue({
      name: 'Existing Category',
      description: 'Category Description'
    });

    component.saveCategory();
    fixture.detectChanges();

    expect(component.status).toBe('error');
    expect(component.errorMessage).toBe('Nombre ya en uso, elige otro.');
  });

});
