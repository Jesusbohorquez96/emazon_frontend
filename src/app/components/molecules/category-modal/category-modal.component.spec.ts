import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryModalComponent } from './category-modal.component';
import { CategoryResponse } from 'src/app/models/category.model';

describe('CategoryModalComponent', () => {
  let component: CategoryModalComponent;
  let fixture: ComponentFixture<CategoryModalComponent>;

  const mockCategories: CategoryResponse[] = [
    {
      categoryId: 1, categoryName: 'Category 1',
      categoryDescription: ''
    },
    {
      categoryId: 2, categoryName: 'Category 2',
      categoryDescription: ''
    },
    {
      categoryId: 3, categoryName: 'Category 3',
      categoryDescription: ''
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoryModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit closeModalEvent when closeModal is called', () => {
    component.closeModal();
    expect(component.closeModalEvent.emit);
  });

  it('should emit categorySelectedEvent when handleCategoryChange is called with valid categories', () => {
    const selectedCategories = mockCategories.slice(0, 2); 
    component.handleCategoryChange(selectedCategories);
    expect(component.categorySelectedEvent.emit);
  });

  it('should set errorMessage if more than 3 categories are selected', () => {
    const selectedCategories = [...mockCategories, { categoryId: 4, categoryName: 'Category 4', categoryDescription: '' }];
    component.handleCategoryChange(selectedCategories);
    expect(component.errorMessage).toBe('Solo puedes seleccionar hasta 3 categorías');
  });

  it('should clear errorMessage if valid number of categories are selected', () => {
    const selectedCategories = mockCategories.slice(0, 2); 
    component.errorMessage = 'Error previo';
    component.handleCategoryChange(selectedCategories);
    expect(component.errorMessage).toBe('');
  });

  it('should set errorMessage when acceptSelection is called with no categories', () => {
    component.selectedCategories = [];
    component.acceptSelection();
    expect(component.errorMessage).toBe('Selecciona entre 1 y 3 categorías.');
  });

  it('should call closeModal if valid number of categories are selected when acceptSelection is called', () => {
    component.selectedCategories = mockCategories.slice(0, 2); 
    component.acceptSelection();
    expect(component.closeModal);
  });

  it('should return the correct category name for a valid categoryId', () => {
    component.selectedCategories = mockCategories;
    const categoryName = component.getCategoryName(1);
    expect(categoryName).toBe('Category 1');
  });

  it('should return "Categoría" for an invalid categoryId', () => {
    component.selectedCategories = mockCategories;
    const categoryName = component.getCategoryName(999); 
    expect(categoryName).toBe('Categoría ');
  });
});
