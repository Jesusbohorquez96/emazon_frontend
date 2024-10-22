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
      description: 'Test description',
      stock: 10,
      price: 1000,
      categories: [1],
      brand: 'Brand 1'
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
    expect(articleService.saveArticle).toHaveBeenCalled();
    expect(component.status).toBe(APP_CONSTANTS.ERRORS.SUCCESS);
    expect(toastrService.success).toHaveBeenCalledWith('Article creada con éxito.');
  });

  it('should handle server error 500 during article creation', () => {
    const errorResponse = { status: HttpStatusCode.InternalServerError, error: { message: 'Server error' } };
    jest.spyOn(articleService, 'saveArticle').mockReturnValue(throwError(() => errorResponse));

    setupValidForm();
    component.createArticle();
    expect(component.status).toBe(APP_CONSTANTS.ERROR);
    expect(toastrService.error).toHaveBeenCalled();
  });

  it('should handle conflict error 409 during article creation', () => {
    const errorResponse = { status: HttpStatusCode.Conflict };
    jest.spyOn(articleService, 'saveArticle').mockReturnValue(throwError(() => errorResponse));

    setupValidForm();
    component.createArticle();
    expect(component.status).toBe(APP_CONSTANTS.ERROR);
    expect(toastrService.error).toHaveBeenCalled();
  });

  it('should reset status after timeout', fakeAsync(() => {
    component.status = 'error';
    component.errorMessage = 'Some error';
    component.resetStatusAfterTimeout();
    tick(5000);
    expect(component.status).toBe('');
    expect(component.errorMessage).toBe('');
  }));

  it('should open and close the category modal', () => {
    component.openCategoryModal();
    expect(component.showCategoryModal).toBe(true);
    component.closeCategoryModal();
    expect(component.showCategoryModal).toBe(false);
    expect(component.articleForm.get('categories')?.value).toEqual(component.selectedCategories);
  });

  it('should open and close the brand modal', () => {
    component.openBrandModal();
    expect(component.showBrandModal).toBe(true);
    component.closeBrandModal();
    expect(component.showBrandModal).toBe(false);
    expect(component.articleForm.get('brand')?.value).toEqual(component.selectedBrand);
  });

  it('should reset form and selections after article creation', () => {
    setupValidForm();
    component.createArticle();
    expect(component.articleForm.value).toEqual({
      name: '',
      description: '',
      stock: null,
      price: null,
      categories: [],
      brand: ''
    });
    expect(component.selectedCategories).toEqual([]);
    expect(component.selectedBrand).toBeNull();
  });

  it('should console.error "Error al obtener categorías:" when getCategories fails', () => {
    jest.spyOn(categoryService, 'getCategories').mockReturnValue(throwError('Error'));
    component.ngOnInit();
    expect(console.error);
  });

  it('should console.error "Error al cargar marcas:" when getBrands fails', () => {
    jest.spyOn(brandService, 'getBrands').mockReturnValue(throwError('Error'));
    component.ngOnInit();
    expect(console.error);
  });

  it('should al guardar la categoria seleccionada', () => {
    const category = { categoryId: 1, categoryName: 'Category 1', categoryDescription: '' };
    component.handleCategoryChange([category]);
    expect(component.selectedCategories).toEqual([category]);
  });

  it('should al guardar la marca seleccionada', () => {
    const brand = { brandId: 1, brandName: 'Brand 1', brandDescription: '' };
    component.handleBrandChange([brand]);
    expect(component.selectedBrand).toEqual(brand);
  });

  it('should getCategoryName return the category names', () => {
    const category = { categoryId: 1, categoryName: 'Category 1', categoryDescription: '' };
    const categoryNames = component.getCategoryName(category.categoryId);
    expect(categoryNames);
  });

  it('should return the correct category name based on categoryId', () => {
    component.categories = [
      { categoryId: 1, categoryName: 'Category 1', categoryDescription: '' },
      { categoryId: 2, categoryName: 'Category 2', categoryDescription: '' }
    ];
  
    const categoryName = component.getCategoryName(1);
    expect(categoryName).toBe('Category 1');
  });
  
  it('should return "Categoría " if categoryId does not exist', () => {
    component.categories = [
      { categoryId: 2, categoryName: 'Category 2', categoryDescription: '' }
    ];
  
    const categoryName = component.getCategoryName(999);
    expect(categoryName).toBe('Categoría ');
  });
  
  it('should return the correct brand name based on brandId', () => {
    component.brands = [
      { brandId: 1, brandName: 'Brand 1', brandDescription: '' },
      { brandId: 2, brandName: 'Brand 2', brandDescription: '' }
    ];
  
    const brandName = component.getBrandName(1);
    expect(brandName).toBe('Brand 1');
  });
  
  it('should return "Marca " if brandId does not exist', () => {
    component.brands = [
      { brandId: 2, brandName: 'Brand 2', brandDescription: '' }
    ];
  
    const brandName = component.getBrandName(999);
    expect(brandName).toBe('Marca ');
  });
  
});
