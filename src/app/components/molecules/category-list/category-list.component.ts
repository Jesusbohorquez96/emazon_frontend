import { Component, OnInit } from '@angular/core';
import { CategoryResponse } from '@/app/models/category.model';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  fields: any;


  categories: CategoryResponse[] = [];
  columns = [
    { field: 'categoryId', header: 'Id' },
    { field: 'categoryName', header: 'Nombre' },
    { field: 'categoryDescription', header: 'Descripción' }
  ];
  page: number = 0;
  size: number = 4;
  sortBy: string = 'NAME';
  sortDirection: string = 'ASC';
  totalPages: number = 0;
  searchName: string = '';

  constructor(private readonly categoryService: CategoryService) { }

  ngOnInit(): void {
    this.getCategories();
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

  toggleSort() {
    this.sortDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
    this.getCategories();
  }

  updatePageSize() {
    this.page = 0;
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
