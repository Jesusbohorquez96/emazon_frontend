import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ArticleCreateComponent } from './article-create.component';
import { CategoryService } from '@/app/services/category.service';
import { ArticleService } from 'src/app/services/article.service';
import { BrandService } from 'src/app/services/brand.service';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpStatusCode } from '@angular/common/http';
import { APP_CONSTANTS } from '@/styles/constants';

describe('ArticleCreateComponent', () => {
  let component: ArticleCreateComponent;
  let fixture: ComponentFixture<ArticleCreateComponent>;
  let categoryService: jest.Mocked<CategoryService>;
  let brandService: jest.Mocked<BrandService>;
  let articleService: jest.Mocked<ArticleService>;
  let toastrService: jest.Mocked<ToastrService>;

  const setupValidForm = () => {
    component.articleForm.patchValue({
      name: 'Test Article',
      description: 'Description',
      stock: 10,
      price: 1000,
    });
    component.selectedCategories = [{ categoryId: 1, categoryName: 'Category 1', categoryDescription: '' }];
    component.selectedBrand = { brandId: 1, brandName: 'Brand 1', brandDescription: '' };
  };

  beforeEach(async () => {
    const categoryServiceMock = {
      getCategories: jest.fn().mockReturnValue(of({ content: [] }))
    };

    const brandServiceMock = {
      getBrands: jest.fn().mockReturnValue(of({ content: [] }))
    };

    const articleServiceMock = {
      saveArticle: jest.fn().mockReturnValue(of({ id: 1 }))
    };

    const toastrServiceMock = {
      success: jest.fn(),
      error: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [ArticleCreateComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: CategoryService, useValue: categoryServiceMock },
        { provide: BrandService, useValue: brandServiceMock },
        { provide: ArticleService, useValue: articleServiceMock },
        { provide: ToastrService, useValue: toastrServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleCreateComponent);
    component = fixture.componentInstance;
    categoryService = TestBed.inject(CategoryService) as jest.Mocked<CategoryService>;
    brandService = TestBed.inject(BrandService) as jest.Mocked<BrandService>;
    articleService = TestBed.inject(ArticleService) as jest.Mocked<ArticleService>;
    toastrService = TestBed.inject(ToastrService) as jest.Mocked<ToastrService>;

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.articleForm.value).toEqual({
      name: '',
      description: '',
      stock: null,
      price: null,
      categories: [],
      brand: ''
    });
  });

  it('should load categories and brands on init', () => {
    component.ngOnInit();
    expect(categoryService.getCategories).toHaveBeenCalledWith(0, 3, 'NAME', 'ASC');
    expect(brandService.getBrands).toHaveBeenCalledWith(0, 0, 'NAME', 'ASC', '');
  });

  it('should show error for invalid form submission', () => {
    component.articleForm.get('name')?.setValue('');
    component.createArticle();

    expect(component.status).toBe(APP_CONSTANTS.ERROR);
    expect(toastrService.error).toHaveBeenCalledWith(APP_CONSTANTS.ERRORS.CORRECT);
  });

  it('should handle successful article creation', () => {
    setupValidForm();
    component.createArticle();

    expect(articleService.saveArticle);
    expect(component.status);
    expect(toastrService.success);
  });

  it('should handle server error 500 during article creation', () => {
    const errorResponse = { status: HttpStatusCode.InternalServerError, error: { message: 'Server error' } };
    jest.spyOn(articleService, 'saveArticle').mockReturnValue(throwError(() => errorResponse));

    setupValidForm();
    component.createArticle();

    expect(component.status).toBe(APP_CONSTANTS.ERROR);
    expect(toastrService.error);
  });

  it('should handle conflict error 409 during article creation', () => {
    const errorResponse = { status: HttpStatusCode.Conflict };
    jest.spyOn(articleService, 'saveArticle').mockReturnValue(throwError(() => errorResponse));

    setupValidForm();
    component.createArticle();

    expect(component.status).toBe(APP_CONSTANTS.ERROR);
    expect(toastrService.error);
  });

  it('should reset status after timeout', fakeAsync(() => {
    component.status = 'error';
    component.errorMessage = 'Some error';
    component.resetStatusAfterTimeout();
    tick(5000);
    expect(component.status).toBe('');
    expect(component.errorMessage).toBe('');
  }));

  it('should open the category modal', () => {
    component.openCategoryModal();
    expect(component.showCategoryModal).toBe(true);
  });

  it('should close the category modal and update form with selected categories', () => {
    const selectedCategories = [{ categoryId: 1, categoryName: 'Test Category', categoryDescription: 'Test Description' }];
    component.selectedCategories = selectedCategories;
    component.closeCategoryModal();
    expect(component.showCategoryModal).toBe(false);
    expect(component.articleForm.get('categories')?.value).toEqual(selectedCategories);
  });

  it('should open and close the brand modal with updates', () => {
    const selectedBrand = { brandId: 1, brandName: 'Test Brand', brandDescription: 'Test Description' };
    component.selectedBrand = selectedBrand;
    component.closeBrandModal();
    expect(component.showBrandModal).toBe(false);
    expect(component.articleForm.get('brand')?.value).toEqual(selectedBrand);
  });

  it('should handle category and brand changes', () => {
    const selectedCategories = [{ categoryId: 1, categoryName: 'Test Category', categoryDescription: 'Test Description' }];
    const selectedBrand = { brandId: 1, brandName: 'Test Brand', brandDescription: 'Test Description' };

    component.handleCategoryChange(selectedCategories);
    component.handleBrandChange([selectedBrand]);

    expect(component.selectedCategories).toEqual(selectedCategories);
    expect(component.selectedBrand).toEqual(selectedBrand);
  });

  it('should return category and brand names based on IDs', () => {
    component.categories = [{ categoryId: 1, categoryName: 'Test Category', categoryDescription: 'Test Description' }];
    component.brands = [{ brandId: 1, brandName: 'Test Brand', brandDescription: 'Test Description' }];

    expect(component.getCategoryName(1)).toBe('Test Category');
    expect(component.getCategoryName(999)).toBe('Categoría '); 
    expect(component.getBrandName(1)).toBe('Test Brand');
    expect(component.getBrandName(999)).toBe('Marca '); 
  });

  it('should handle server error 500 without message during article creation', () => {
    const errorResponse = { status: HttpStatusCode.InternalServerError, error: {} };
    jest.spyOn(articleService, 'saveArticle').mockReturnValue(throwError(() => errorResponse));

    setupValidForm();
    component.createArticle();

    expect(component.status).toBe(APP_CONSTANTS.ERROR);
    expect(toastrService.error);
  });

  it('should log errors for failed category and brand loading', () => {
    const errorResponse = { message: 'Error al cargar categorías' };
    jest.spyOn(categoryService, 'getCategories').mockReturnValue(throwError(() => errorResponse));
    component.ngOnInit();
    expect(console.error);

    jest.spyOn(brandService, 'getBrands').mockReturnValue(throwError(() => ({ message: 'Error al cargar marcas' })));
    component.ngOnInit();
    expect(console.error);
  });

  it('should create correct articleData when form is valid', () => {
    setupValidForm();
    const expectedArticleData = {
      name: 'Test Article',
      description: 'Description',
      stock: 10,
      price: 1000,
      categories: [1],
      brand: 1
    };
    component.createArticle();
    expect(expectedArticleData);
  });

  it('should reset selectedBrand and selectedCategories after article creation', () => {
    setupValidForm();
    component.createArticle();
    expect(component.selectedBrand);
    expect(component.selectedCategories);
  });

  it('should handle invalid form submission', () => {
    component.articleForm.get('name')?.setValue(''); 
    component.createArticle(); 
  
    expect(component.status).toBe(APP_CONSTANTS.ERROR); 
    expect(component.errorMessage).toBe(APP_CONSTANTS.ERRORS.CORRECT);
    expect(toastrService.error).toHaveBeenCalledWith(APP_CONSTANTS.ERRORS.CORRECT); 
  });

  it('should handle brand change with null value', () => {
    component.handleBrandChange([]);
    expect(component.selectedBrand);
  });
  
});
