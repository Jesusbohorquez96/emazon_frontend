import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '@/app/services/category.service';
import { ArticleService } from 'src/app/services/article.service';
import { BrandService } from 'src/app/services/brand.service';
import { CategoryResponse } from 'src/app/models/category.model';
import { BrandResponse } from 'src/app/models/brand.model';
import { APP_CONSTANTS } from '@/styles/constants';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-article-create',
  templateUrl: './article-create.component.html',
  styleUrls: ['./article-create.component.scss']
})
export class ArticleCreateComponent implements OnInit {

  articleForm: FormGroup;
  categories: CategoryResponse[] = [];
  selectedBrands: BrandResponse[] = [];
  selectedCategories: CategoryResponse[] = [];
  selectedBrand: BrandResponse | null = null;

  showCategoryModal = false;
  showBrandModal = false;
  status: string = '';
  errorMessage!: string;

  constructor(
    private readonly fb: FormBuilder,
    private readonly articleService: ArticleService,
    private readonly categoryService: CategoryService,
    private readonly brandService: BrandService
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
        this.selectedBrands = response.content || [];
        console.log('Marcas cargadas:', this.selectedBrands);
      },
      error: (error) => {
        console.error('Error al cargar marcas:', error);
      }
    });
  }

  openCategoryModal(): void {
    this.showCategoryModal = true;
  }

  closeCategoryModal(): void {
    this.showCategoryModal = false;
    this.articleForm.patchValue({ categories: this.selectedCategories });
  }

  openBrandModal(): void {
    this.showBrandModal = true;
  }

  closeBrandModal(): void {
    this.showBrandModal = false;
    this.articleForm.patchValue({ brand: this.selectedBrand });
  }


  handleCategoryChange(selectedCategories: CategoryResponse[]): void {
    console.log('Categorías seleccionadas:', selectedCategories);

    if (selectedCategories.length > 3) {
      this.selectedCategories = this.selectedCategories.slice(0, 3);
      this.errorMessage = 'Solo puedes seleccionar hasta 3 categorías';
      return;
    }

    this.errorMessage = '';
    this.selectedCategories = selectedCategories;
    console.log('Categorías seleccionadas:', this.selectedCategories);
  }

  handleBrandChange(selectedBrands: BrandResponse[]): void {
    console.log('Marcas seleccionadas:', selectedBrands);
  
    if (selectedBrands.length > 1) {
      const selectedBrands = this.selectedBrands.slice(0);
      this.selectedBrands = selectedBrands;
  
     this.errorMessage = 'Solo puedes seleccionar hasta 3 categorías';
      return;
    }
    this.selectedBrands = selectedBrands;
    console.log('Marcas seleccionadas:', this.selectedBrands);
    this.selectedBrand = this.selectedBrands[0];
  }
  
  getCategoryName(categoryId: number): string {
    let category = this.categories.find(cat => cat.categoryId === categoryId);
    return category ? category.categoryName : 'Categoría ';
  }

  getBrandName(brandId: number): string {
    const brand = this.selectedBrands.find(b => b.brandId === brandId);
    return brand ? brand.brandName : 'Marca ';
  }

  createArticle(): void {

    if (this.articleForm && this.articleForm.invalid) {
      this.status = APP_CONSTANTS.ERROR;
      this.errorMessage = APP_CONSTANTS.ERRORS.CORRECT; 
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
        this.resetStatusAfterTimeout(); 
      }
    });
  }
  resetForm() {
    throw new Error('Method not implemented.');
  }
  resetStatusAfterTimeout() {
    setTimeout(() => {
      this.status = ''; 
      this.errorMessage = ''; 
    }, 5000);
  }
}
