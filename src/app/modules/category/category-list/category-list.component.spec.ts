import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryListComponent } from './category-list.component';
import { CategoryService } from '../../../services/category.service';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CategoryListComponent', () => {
  let component: CategoryListComponent;
  let fixture: ComponentFixture<CategoryListComponent>;
  let categoryService: CategoryService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoryListComponent],
      imports: [HttpClientTestingModule],
      providers: [CategoryService]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryListComponent);
    component = fixture.componentInstance;
    categoryService = TestBed.inject(CategoryService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch categories successfully', () => {
    const mockResponse = {
      content: [
        { categoryId: 1, categoryName: 'Test 1', categoryDescription: 'Description 1' },
        { categoryId: 2, categoryName: 'Test 2', categoryDescription: 'Description 2' }
      ],
      totalPages: 1
    };

    jest.spyOn(categoryService, 'getCategories').mockReturnValue(of(mockResponse));
    component.getCategories();

    expect(component.categories.length).toBe(2);
    expect(component.totalPages).toBe(1);
  });

  it('should handle error when fetching categories', () => {
    jest.spyOn(categoryService, 'getCategories').mockReturnValue(throwError(() => new Error('Error al obtener las categorías')));
    component.getCategories();
    expect(component.categories.length).toBe(0);

  });

  it('should toggle sort direction and fetch categories', () => {
    component.sortDirection = 'ASC';
    component.toggleSort();
    expect(component.sortDirection).toBe('DESC');
    expect(component.page).toBe(0);

    component.toggleSort();
    expect(component.sortDirection).toBe('ASC');
  });



  it('should search by name and fetch categories', () => {
    component.searchName = 'Test Category';
    component.searchByName();
    expect(component.page).toBe(0);
  });

  it('should change to the next page', () => {
    component.totalPages = 3;
    component.page = 1;
    component.nextPage();
    expect(component.page).toBe(2);

    component.nextPage();
    expect(component.page).toBe(2);
  });

  it('should change to the previous page', () => {
    component.page = 2;
    component.prevPage();
    expect(component.page).toBe(1);

    component.prevPage();
    expect(component.page).toBe(0);
  });

  it('should go to a specific valid page', () => {
    component.totalPages = 5;
    component.goToPage(2);
    expect(component.page).toBe(2);
  });

  it('should not go to an invalid page', () => {
    component.totalPages = 3;
    component.goToPage(5);
    expect(component.page).not.toBe(5);
  });

  it('should call onPageChange and get categories', () => {
    const spyGetCategories = jest.spyOn(component, 'getCategories');
    component.onPageChange(2);
    expect(component.page).toBe(2);
    expect(spyGetCategories).toHaveBeenCalled();
  });

  it('should handle response without content or totalPages', () => {
    const mockResponse = {};

    jest.spyOn(categoryService, 'getCategories').mockReturnValue(of(mockResponse));

    component.getCategories();

    expect(component.categories).toBe(mockResponse);
    expect(component.totalPages).toBe(0);
  });

  it('should emit selected categories when handleCategoryChange is called', () => {
    const selectedCategories = [{ categoryId: 1, categoryName: 'Test 1', categoryDescription: 'Description 1' }];
    const spyEmit = jest.spyOn(component.categoriesSelected, 'emit');

    component.handleCategoryChange(selectedCategories);

    expect(spyEmit).toHaveBeenCalledWith(selectedCategories);
  });

  it('should emit selected categories when onCategorySelectionChange is called', () => {
    const selectedCategories = [{ categoryId: 2, categoryName: 'Test 2', categoryDescription: 'Description 2' }];
    const spyEmit = jest.spyOn(component.categoriesSelected, 'emit');

    component.onCategorySelectionChange(selectedCategories);

    expect(spyEmit).toHaveBeenCalledWith(selectedCategories);
  });

  it('should update size to 1 if less than 1', () => {
    component.size = 0;
    jest.spyOn(component, 'search');
    component.updatePageSize();
    expect(component.size).toBe(1);
    expect(component.page).toBe(0);
    expect(component.search).toHaveBeenCalled();
  });

  it('should update size to 10 if greater than 10', () => {
    component.size = 15;
    jest.spyOn(component, 'search');
    component.updatePageSize();
    expect(component.size).toBe(10);
    expect(component.page).toBe(0);
    expect(component.search).toHaveBeenCalled();
  });

  it('should keep size between 1 and 10', () => {
    component.size = 5;
    jest.spyOn(component, 'search');
    component.updatePageSize();
    expect(component.size).toBe(5);
    expect(component.page).toBe(0);
    expect(component.search).toHaveBeenCalled();
  });

  it('should load categories and set them from response content', () => {
    const mockCategories = [{ id: 1, name: 'Category 1' }, { id: 2, name: 'Category 2' }];
    const mockResponse = { content: mockCategories };
    jest.spyOn(categoryService, 'getCategories').mockReturnValue(of(mockResponse));
  
    component.loadCategories();
  
    expect(categoryService.getCategories).toHaveBeenCalledWith(0, 0, 'NAME', 'ASC'); 
    expect(component.categories).toEqual(mockCategories);
  });
});
