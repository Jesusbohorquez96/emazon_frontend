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

  describe('createArticle', () => {
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
  });

  it('should reset status after timeout', fakeAsync(() => {
    component.status = 'error';
    component.errorMessage = 'Some error';
    component.resetStatusAfterTimeout();
    tick(5000);
    expect(component.status).toBe('');
    expect(component.errorMessage).toBe('');
  }));

  describe('modals', () => {
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
  });

  describe('removeItem', () => {
    it('should remove a category from the selectedCategories list', () => {
      const categoryToRemove = { categoryId: 1, categoryName: 'Category 1', categoryDescription: '' };
      component.selectedCategories = [
        { categoryId: 1, categoryName: 'Category 1', categoryDescription: '' },
        { categoryId: 2, categoryName: 'Category 2', categoryDescription: '' },
      ];

      component.removeItem('category', categoryToRemove);

      expect(component.selectedCategories).toEqual([
        { categoryId: 2, categoryName: 'Category 2', categoryDescription: '' },
      ]);
      expect(component.articleForm.get('categories')?.value).toEqual([
        { categoryId: 2, categoryName: 'Category 2', categoryDescription: '' },
      ]);
    });

    it('should remove the selected brand and reset the brand form control', () => {
      component.selectedBrand = { brandId: 1, brandName: 'Brand 1', brandDescription: '' };
      component.showBrandModal = true;

      jest.useFakeTimers();
      component.removeItem('brand');
      jest.runAllTimers();

      expect(component.selectedBrand).toBeNull();
      expect(component.articleForm.get('brand')?.value).toBeNull();
      expect(component.showBrandModal).toBe(true);
    });
  });

  describe('helper methods', () => {
    it('should return the correct category name', () => {
      component.categories = [
        { categoryId: 1, categoryName: 'Category 1', categoryDescription: '' },
      ];
      const categoryName = component.getCategoryName(1);
      expect(categoryName).toBe('Category 1');
    });

    it('should return "Categoría " if category ID does not exist', () => {
      const categoryName = component.getCategoryName(999);
      expect(categoryName).toBe('Categoría ');
    });

    it('should return the correct brand name', () => {
      component.brands = [
        { brandId: 1, brandName: 'Brand 1', brandDescription: '' },
      ];
      const brandName = component.getBrandName(1);
      expect(brandName).toBe('Brand 1');
    });

    it('should return "Marca " if brand ID does not exist', () => {
      const brandName = component.getBrandName(999);
      expect(brandName).toBe('Marca ');
    });
  });

  describe('handleCategoryChange', () => {
    it('should update categories and selectedCategories when valid categories are passed', () => {
      const mockCategories = [
        { categoryId: 1, categoryName: 'Category 1', categoryDescription: '' },
      ];
  
      component.handleCategoryChange(mockCategories);
  
      expect(component.categories).toEqual(mockCategories);
      expect(component.selectedCategories).toEqual(mockCategories);
    });
  
    it('should set categories and selectedCategories to empty when no categories are passed', () => {
      component.handleCategoryChange([]);
  
      expect(component.categories).toEqual([]);
      expect(component.selectedCategories).toEqual([]);
    });
  });

  describe('handleBrandChange', () => {
    it('should update selectedBrand to the first item when multiple brands are passed', () => {
      const mockBrands = [
        { brandId: 1, brandName: 'Brand 1', brandDescription: '' },
        { brandId: 2, brandName: 'Brand 2', brandDescription: '' },
      ];
  
      component.handleBrandChange(mockBrands);
  
      expect(component.brands).toEqual(mockBrands);
      expect(component.selectedBrand).toEqual(mockBrands[0]);
    });
  
    it('should set selectedBrand to null when no brands are passed', () => {
      component.handleBrandChange([]);
  
      expect(component.brands).toEqual([]);
      expect(component.selectedBrand).toBeNull();
    });
  });
  
  it('should handle error when loading categories', () => {
    jest.spyOn(categoryService, 'getCategories').mockReturnValue(throwError(() => 'Error al cargar categorías'));
    component.loadCategories();
    expect(console.error);
  });
  
  it('should handle error when loading brands', () => {
    jest.spyOn(brandService, 'getBrands').mockReturnValue(throwError(() => 'Error al cargar marcas'));
    component.loadBrands();
    expect(console.error);
  });
  
  
});
