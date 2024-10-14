import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '@/app/services/category.service';
import { ArticleService } from 'src/app/services/article.service';
import { BrandService } from 'src/app/services/brand.service';
import { CategoryResponse } from 'src/app/models/category.model';
import { BrandResponse } from 'src/app/models/brand.model';

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
  categoryId: number = 0;
  brandId: number = 0;
  status!: string;
  errorMessage!: string;

  constructor(
    private readonly fb: FormBuilder,
    private readonly articleService: ArticleService,
    private readonly categoryService: CategoryService,
    private readonly brandService: BrandService
  ) {
    this.articleForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(120)]],
      stock: [0, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(1000)]],
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
      alert('Solo puedes seleccionar hasta 3 categorías');
      return;
    }

    this.selectedCategories = selectedCategories;
    console.log('Categorías seleccionadas:', this.selectedCategories);
  }

  handleBrandChange(selectedBrands: BrandResponse[]): void {
    console.log('Marcas seleccionadas:', selectedBrands);
  
    if (selectedBrands.length > 1) {
      const selectedBrands = this.selectedBrands.slice(0);
      this.selectedBrands = selectedBrands;
  
      alert('Solo puedes seleccionar hasta 1 marcas');
      return;
    }
    this.selectedBrands = selectedBrands;
    console.log('Marcas seleccionadas:', this.selectedBrands);
    this.selectedBrand = this.selectedBrands[0];
  }
  

  onCategoryChange( categoryId: number): void {
    const category = this.categories.find(cat => cat.categoryId === categoryId);
    if (category) {
      this.selectedCategories.push(category);
    }
  }

  onBrandChange(brandId: number): void {
    const brand = this.selectedBrands.find(b => b.brandId === brandId);
    if (brand) {
      this.selectedBrand = brand;
    }
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
    if (this.articleForm.valid) {
      const articleData = {
        ...this.articleForm.value,
        categories: this.selectedCategories.map(category => category.categoryId),
        brand: this.selectedBrand?.brandId
      };
  
      console.log('Datos del artículo a enviar:', articleData);
  
      this.articleService.saveArticle(articleData).subscribe({
        next: (response) => {
          alert('Artículo creado con éxito');
          this.articleForm.reset();
          this.selectedCategories = [];
          this.selectedBrand = null;
        },
        error: (error) => {
          alert('Error al crear el artículo');
          console.error('Error al crear el artículo:', error);
        }
      });
    } else {
      alert('El formulario contiene errores. Por favor revisa los campos.');
    }
  }
  
}
