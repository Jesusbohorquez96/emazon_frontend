import { Component, OnInit } from '@angular/core';
import { Category, CategoryResponse } from './models/category.model';
import { CategoryService } from './service/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  categories: CategoryResponse[] = [];
  category: Category = {
    id: 0,
    name: '',
    description: ''
  };

  page: number = 0;             
  size: number = 1;    
  sortBy: string = 'NAME';        
  sortDirection: string = 'ASC';         
  totalPages: number = 0;
  searchName: string = '';
  status: string = '';
  statusTimeout: any;

  constructor(private categoryService: CategoryService) { }

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

  saveCategory() {
    this.categoryService.saveCategory(this.category).subscribe(
      (response) => {
        console.log('Categoría guardada:', response);
        this.status = 'success'; 
        this.getCategories();
        this.resetForm();
        this.resetStatusAfterTimeout(); 
      },
      (error) => {
        console.error('Error al guardar la categoría:', error);
        this.status = 'error'; 
        this.resetStatusAfterTimeout(); 
      }
    );
  }

  resetForm() {
    this.category = { id: 0, name: '', description: '' };
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