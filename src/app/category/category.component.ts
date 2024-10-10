import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoryResponse } from './models/category.model';
import { CategoryService } from '../services/category.service';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  categories: CategoryResponse[] = [];
  categoryForm!: FormGroup;

  page: number = 0;
  size: number = 1;
  sortBy: string = 'NAME';
  sortDirection: string = 'ASC';
  totalPages: number = 0;
  searchName: string = '';
  status: string = '';
  statusTimeout: any;
  errorMessage: string = '';
  search: any;

  constructor(private readonly categoryService: CategoryService) { }

  ngOnInit(): void {
    this.getCategories();


    this.categoryForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(90)]),
    });
  }

  getCategories() {
    this.categoryService.getCategories(this.page, this.size, this.sortBy, this.sortDirection, this.searchName).subscribe(
      (response) => {
        console.log('Respuesta de la API:', response);
        this.categories = response.content || response;
        this.totalPages = response.totalPages || 0;
      },
      (error) => {
        console.error('Error al obtener las categorías:', error);
      }
    );
  }

  saveCategory() {
    if (this.categoryForm && this.categoryForm.invalid) {
      this.status = 'error';
      this.errorMessage = 'Corrige los errores del formulario.';
      this.resetStatusAfterTimeout();
      return;
    }

    const categoryData = this.categoryForm ? this.categoryForm.value : {};

    this.categoryService.saveCategory(categoryData).subscribe(
      (response) => {
        console.log('Saved Category:', response);
        this.status = 'success';
        this.getCategories();
        this.resetForm();
        this.resetStatusAfterTimeout();
      },
      (error) => {
        console.error('Error al guardar la categoría:', error);
        let errorMessage = 'Ocurrió un error al guardar.';

        if (error.status === HttpStatusCode.InternalServerError) {
          if (error.error && error.error.message) {
            errorMessage = 'Error en los datos ingresados.';
          }
        }

        if (error.status === HttpStatusCode.Conflict) {
          errorMessage = 'Nombre ya en uso, elige otro.';
        }

        this.status = 'error';
        this.errorMessage = errorMessage;
        this.resetStatusAfterTimeout();
      }
    );
  }

  resetForm() {
    if (this.categoryForm) {
      this.categoryForm.reset();
    }
  }

  resetStatusAfterTimeout() {
    if (this.statusTimeout) {
      clearTimeout(this.statusTimeout);
    }
    this.statusTimeout = setTimeout(() => {
      this.status = '';
    }, 5000);
  }

  updatePageSize() {
    this.page = 0;
    this.getCategories();
  }

  toggleSort() {
    this.sortDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
    this.getCategories();
  }

  searchByName() {
    this.page = 0;
    this.getCategories();
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.getCategories();
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.page = page;
      this.getCategories();
    }
  }

  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.getCategories();
    }
  }

  prevPage() {
    if (this.page > 0) {
      this.page--;
      this.getCategories();
    }
  }
}