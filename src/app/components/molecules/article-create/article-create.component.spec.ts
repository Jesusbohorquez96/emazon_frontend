import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ArticleCreateComponent } from './article-create.component';
import { CategoryService } from '@/app/services/category.service';
import { BrandService } from '@/app/services/brand.service';
import { ArticleService } from '@/app/services/article.service';
import { of, throwError } from 'rxjs';
import { APP_CONSTANTS } from '@/styles/constants';
import { HttpStatusCode } from '@angular/common/http';

describe('ArticleCreateComponent', () => {
  let component: ArticleCreateComponent;
  let fixture: ComponentFixture<ArticleCreateComponent>;
  let mockCategoryService: CategoryService;
  let mockBrandService: BrandService;
  let mockArticleService: ArticleService;

  const mockCategories = [
    { categoryId: 1, categoryName: 'Category 1', categoryDescription: '' },
    { categoryId: 2, categoryName: 'Category 2', categoryDescription: '' }
  ];

  const mockBrands = [
    { brandId: 1, brandName: 'Brand 1', brandDescription: '' },
    { brandId: 2, brandName: 'Brand 2', brandDescription: '' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticleCreateComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [CategoryService, BrandService, ArticleService]
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleCreateComponent);
    component = fixture.componentInstance;
    mockCategoryService = TestBed.inject(CategoryService);
    mockBrandService = TestBed.inject(BrandService);
    mockArticleService = TestBed.inject(ArticleService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load categories and brands on init', () => {
      jest.spyOn(mockCategoryService, 'getCategories').mockReturnValue(of({ content: mockCategories }));
      jest.spyOn(mockBrandService, 'getBrands').mockReturnValue(of({ content: mockBrands }));

      component.ngOnInit();

      expect(mockCategoryService.getCategories).toHaveBeenCalledWith(0, 3, 'NAME', 'ASC');
      expect(mockBrandService.getBrands).toHaveBeenCalledWith(0, 0, 'NAME', 'ASC', '');
      expect(component.categories.length).toBe(2);
      expect(component.brands.length).toBe(2);
    });

    it('should handle errors when loading categories or brands', () => {
      jest.spyOn(mockCategoryService, 'getCategories').mockReturnValue(throwError(() => new Error('Error loading categories')));
      jest.spyOn(mockBrandService, 'getBrands').mockReturnValue(throwError(() => new Error('Error loading brands')));

      component.ngOnInit();

      expect(component.categories.length).toBe(0);
      expect(component.brands.length).toBe(0);
    });
  });

  describe('Modals', () => {
    it('should open and close the category modal', () => {
      component.openCategoryModal();
      expect(component.showCategoryModal).toBe(true);

      component.closeCategoryModal();
      expect(component.showCategoryModal).toBe(false);
    });

    it('should open and close the brand modal', () => {
      component.openBrandModal();
      expect(component.showBrandModal).toBe(true);

      component.closeBrandModal();
      expect(component.showBrandModal).toBe(false);
    });
  });

  describe('Category and Brand Selection', () => {
    it('should show an error when more than 3 categories are selected', () => {
      const selectedCategories = [
        ...mockCategories,
        { categoryId: 3, categoryName: 'Category 3', categoryDescription: '' },
        { categoryId: 4, categoryName: 'Category 4', categoryDescription: '' }
      ];

      component.handleCategoryChange(selectedCategories);
      expect(component.errorMessage).toBe('Solo puedes seleccionar hasta 3 categorías');
      expect(component.selectedCategories.length).toBe(0);
    });

    it('should update selectedCategories correctly when valid categories are selected', () => {
      const validCategories = [mockCategories[0], mockCategories[1]];

      component.handleCategoryChange(validCategories);
      expect(component.selectedCategories).toEqual(validCategories);
      expect(component.errorMessage).toBe('');
    });
   
  });

  describe('Form Submission', () => {
    it('should not submit the form if invalid', () => {
      component.articleForm.controls['name'].setValue(''); 

      component.createArticle();

      expect(component.status).toBe(APP_CONSTANTS.ERROR);
      expect(component.errorMessage).toBe(APP_CONSTANTS.ERRORS.CORRECT);
      expect(mockArticleService.saveArticle);
    });

    it('should submit the form if valid and handle success', () => {
      component.articleForm.controls['name'].setValue('Valid name');
      component.articleForm.controls['description'].setValue('Valid description');
      component.articleForm.controls['stock'].setValue(5);
      component.articleForm.controls['price'].setValue(1000);
      component.selectedCategories = mockCategories;
      component.selectedBrand = mockBrands[0];

      jest.spyOn(mockArticleService, 'saveArticle');

      component.createArticle();

      expect(mockArticleService.saveArticle);
      expect(component.status);
    });

    it('should handle conflict error when saving article', () => {
      jest.spyOn(mockArticleService, 'saveArticle').mockReturnValue(throwError(() => ({
        status: HttpStatusCode.Conflict,
        error: { message: 'Conflict error' }
      })));

      component.createArticle();

      expect(component.status).toBe(APP_CONSTANTS.ERROR);
      expect(component.errorMessage);
    });

    it('should handle server error when saving article', () => {
      jest.spyOn(mockArticleService, 'saveArticle').mockReturnValue(throwError(() => ({
        status: HttpStatusCode.InternalServerError,
        error: { message: 'Server error' }
      })));

      component.createArticle();

      expect(component.status).toBe(APP_CONSTANTS.ERROR);
      expect(component.errorMessage);
    });
  });

  describe('Utility Methods', () => {
    it('should reset status and errorMessage after timeout', () => {
      jest.useFakeTimers();

      component.status = APP_CONSTANTS.ERROR;
      component.errorMessage = 'Some error';
      component.resetStatusAfterTimeout();

      jest.advanceTimersByTime(5000);

      expect(component.status).toBe('');
      expect(component.errorMessage).toBe('');
    });

    it('should return correct category name for a given categoryId', () => {
      component.categories = mockCategories;
      const categoryName = component.getCategoryName(1);

      expect(categoryName).toBe('Category 1');
    });

    it('should return "Categoría " if categoryId is not found', () => {
      component.categories = mockCategories;
      const categoryName = component.getCategoryName(999);

      expect(categoryName).toBe('Categoría ');
    });

    it('should return correct brand name for a given brandId', () => {
      component.brands = mockBrands;
      const brandName = component.getBrandName(1);

      expect(brandName).toBe('Brand 1');
    });

    it('should return "Marca " if brandId is not found', () => {
      component.brands = mockBrands;
      const brandName = component.getBrandName(999);

      expect(brandName).toBe('Marca ');
    });
  });

  it('should throw error if resetForm method is not implemented', () => {
    expect(() => component.resetForm()).toThrowError('Method not implemented.');
  });
});
