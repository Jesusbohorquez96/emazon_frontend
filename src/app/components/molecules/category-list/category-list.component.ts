import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Category, CategoryResponse } from '@/app/models/category.model';
import { CategoryService } from '../../../services/category.service';
import { APP_CONSTANTS } from '@/styles/constants';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {

  @Input() selectedEnabled: boolean = false;
  @Input() showTitle: boolean = true;
  @Input() showLabel: boolean = true;
  @Input() pageSize: number = 5; 
  @Input() showPageSizeControl: boolean = true;
  @Input() selectedCategories: CategoryResponse[] = [];
  @Input() columns: { field: string, header: string }[] = [
    { field: APP_CONSTANTS.CATEGORY.ID, header: APP_CONSTANTS.ID },
    { field: APP_CONSTANTS.CATEGORY.NAME, header: APP_CONSTANTS.SPANISH.NAME },
    { field: APP_CONSTANTS.CATEGORY.DESCRIPTION, header: APP_CONSTANTS.SPANISH.DESCRIPTION },
  ];
  @Output() categoriesSelected = new EventEmitter<CategoryResponse[]>();

  categories: Category[] = [];
 
  page: number = APP_CONSTANTS.PAGINATION.ZERO;
  size: number = APP_CONSTANTS.NUMBER.MAX_RETRIES;
  sortBy: string = APP_CONSTANTS.PAGINATION.NAME;
  sortDirection: string = APP_CONSTANTS.PAGINATION.ASC;
  totalPages: number = APP_CONSTANTS.PAGINATION.ZERO;
  searchName: string = '';

  constructor(private readonly categoryService: CategoryService) { }

  ngOnInit(): void {
    this.loadCategories();
    this.getCategories();
  }

  getCategories() {
    console.log('Parámetros enviados a la API:', this.page, this.size, this.sortBy, this.sortDirection, this.searchName);

    this.categoryService.getCategories(this.page, this.size, this.sortBy, this.sortDirection, this.searchName).subscribe(
      (response) => {
        console.log('Respuesta de categorías desde la API:', response);
        this.categories = response.content || response;
        this.totalPages = response.totalPages || APP_CONSTANTS.PAGINATION.ZERO;
      },
      (error) => {
        console.error('Error al obtener categorías:', error);
      }
    );
  }

  handleCategoryChange(Category: CategoryResponse[]) {
    this.categoriesSelected.emit(Category);
  }

  onCategorySelectionChange(selectedCategories: CategoryResponse[]): void {
    console.log('Emitiendo categorías seleccionadas:', selectedCategories);
    this.categoriesSelected.emit(selectedCategories);
  }

  loadCategories(): void {
    this.categoryService.getCategories(0, 0, 'NAME', 'ASC').subscribe((response: any) => {
      this.categories = response.content;
    });
  }

  toggleSort() {
    this.sortDirection = this.sortDirection === APP_CONSTANTS.PAGINATION.ASC ? APP_CONSTANTS.PAGINATION.DESC : APP_CONSTANTS.PAGINATION.ASC;
    this.getCategories();
  }

  updatePageSize() {
    this.page = APP_CONSTANTS.PAGINATION.ZERO;
    this.getCategories();
  }

  searchByName() {
    this.page = APP_CONSTANTS.PAGINATION.ZERO;
    this.getCategories();
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.getCategories();
  }

  goToPage(page: number) {
    if (page >= APP_CONSTANTS.PAGINATION.ZERO && page < this.totalPages) {
      this.page = page;
      this.getCategories();
    }
  }

  nextPage() {
    if (this.page < this.totalPages - APP_CONSTANTS.NUMBER.ONE) {
      this.page++;
      this.getCategories();
    }
  }

  prevPage() {
    if (this.page > APP_CONSTANTS.PAGINATION.ZERO) {
      this.page--;
      this.getCategories();
    }
  }
}
