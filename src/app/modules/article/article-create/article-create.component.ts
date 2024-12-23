import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '@/app/services/category.service';
import { ArticleService } from 'src/app/services/article.service';
import { BrandService } from 'src/app/services/brand.service';
import { CategoryResponse } from 'src/app/models/category.model';
import { BrandResponse } from 'src/app/models/brand.model';
import { APP_CONSTANTS } from '@/styles/constants';
import { HttpStatusCode } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-article-create',
  templateUrl: './article-create.component.html',
  styleUrls: ['./article-create.component.scss']
})
export class ArticleCreateComponent implements OnInit {

  articleForm: FormGroup;
  categories: CategoryResponse[] = [];
  brands: BrandResponse[] = [];
  selectedCategories: CategoryResponse[] = [];
  selectedBrand: BrandResponse | null = null;

  showMainModal = false;
  showCategoryModal = false;
  showBrandModal = false;
  status: string = '';
  errorMessage!: string;
  show: boolean = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly articleService: ArticleService,
    private readonly categoryService: CategoryService,
    private readonly brandService: BrandService,
    private readonly toastr: ToastrService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.articleForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(90)]],
      stock: [null, [Validators.required, Validators.min(1)]],
      price: [null, [Validators.required, Validators.min(1000)]],
      categories: [[], [Validators.required]],
      brand: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadBrands();
  }

  loadCategories(): void {
    this.categoryService.getCategories(0, 3, 'NAME', 'ASC').subscribe({
      next: (response: any) => {
        this.categories = response.content || [];
        console.log('Categorías cargadas:', this.categories);
      },
      error: (error: any) => {
        console.error('Error al cargar categorías', error);
      }
    });
  }

  loadBrands(): void {
    this.brandService.getBrands(0, 0, 'NAME', 'ASC', '').subscribe({
      next: (response: any) => {
        this.brands = response.content || [];
        console.log('Marcas cargadas:', this.brands);
      },
      error: (error) => {
        console.error('Error al cargar marcas:', error);
      }
    });
  }

  openMainModal(): void {
    this.showMainModal = true;
  }

  closeMainModal(): void {
    this.showMainModal = false;
  }

  openCategoryModal(): void {
    this.closeMainModal();
    this.showCategoryModal = true;
  }

  closeCategoryModal(): void {
    this.showCategoryModal = false;
    this.articleForm.patchValue({ categories: this.selectedCategories });
    this.openMainModal();
  }

  openBrandModal(): void {
    this.closeMainModal();
    this.showBrandModal = true;
  }

  closeBrandModal(): void {
    this.showBrandModal = false;
    this.articleForm.patchValue({ brand: this.selectedBrand });
    this.openMainModal();
  }

  handleCategoryChange(selectedCategories: CategoryResponse[]): void {
    this.categories = selectedCategories;
    this.selectedCategories = this.categories;
  }

  handleBrandChange(selectedBrands: BrandResponse[]): void {
    this.brands = selectedBrands;
    this.selectedBrand = selectedBrands.length > 0 ? selectedBrands[0] : null; 
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(cat => cat.categoryId === categoryId);
    return category ? category.categoryName : 'Categoría ';
  }

  getBrandName(brandId: number): string {
    const brand = this.brands.find(bra => bra.brandId === brandId);
    return brand ? brand.brandName : 'Marca ';
  }

  createArticle(): void {
    if (this.articleForm && this.articleForm.invalid) {
      this.status = APP_CONSTANTS.ERROR;
      this.errorMessage = APP_CONSTANTS.ERRORS.CORRECT;
      this.toastr.error(this.errorMessage);
      this.resetStatusAfterTimeout();
      return;
    }

    const articleData = {
      ...this.articleForm.value,
      categories: this.selectedCategories.map(category => category.categoryId),
      brand: this.selectedBrand?.brandId
    };

    this.articleService.saveArticle(articleData).subscribe({
      next: (response) => {
        console.log(APP_CONSTANTS.ERRORS.SAVED, response);
        this.status = APP_CONSTANTS.ERRORS.SUCCESS;
        this.toastr.success('Article creada con éxito.');
        this.resetForm();
        this.resetStatusAfterTimeout();
      },
      error: (error) => {
        console.error(APP_CONSTANTS.ERRORS.ERROR, error);
        let errorMessage = APP_CONSTANTS.ERRORS.OCCURRED;

        if (error.status === HttpStatusCode.InternalServerError) {
          if (error.error && error.error.message) {
            errorMessage = APP_CONSTANTS.ERRORS.DATA;
          }
        }

        if (error.status === HttpStatusCode.Conflict) {
          errorMessage = APP_CONSTANTS.ERRORS.USE;
        }

        this.status = APP_CONSTANTS.ERROR;
        this.errorMessage = errorMessage;
        this.toastr.error(this.errorMessage);
        this.resetStatusAfterTimeout();
      }
    });
  }

  resetForm(): void {
    this.articleForm.reset({
      name: '',
      description: '',
      stock: null,
      price: null,
      categories: [],
      brand: '' 
    });
    this.selectedCategories = [];
    this.selectedBrand = null;
  }

  resetStatusAfterTimeout() {
    setTimeout(() => {
      this.status = '';
      this.errorMessage = '';
    }, 5000);
  }

  removeItem(type: 'category' | 'brand', itemToRemove?: CategoryResponse | BrandResponse): void {
    if (type === 'category' && itemToRemove) {
      this.selectedCategories = this.selectedCategories.filter(
        (category) => category.categoryId !== (itemToRemove as CategoryResponse).categoryId
      );
      this.articleForm.patchValue({ categories: this.selectedCategories });
      console.log('Categoría eliminada. Estado actual:', this.selectedCategories);
    } else if (type === 'brand') {
      console.log('Eliminando marca seleccionada:', this.selectedBrand);
      this.selectedBrand = null;
      this.articleForm.patchValue({ brand: null });
  
      if (this.showBrandModal) {
        this.showBrandModal = false;
        setTimeout(() => {
          this.showBrandModal = true;
        });
      }
      console.log('Marca eliminada. Estado actual:', this.selectedBrand);
    }
  }
}
