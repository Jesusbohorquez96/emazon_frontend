// import { ButtonComponent } from '@/app/components/atoms/button/button.component';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CategoryResponse } from 'src/app/models/category.model';
// import { CategoryListComponent } from '../category-list/category-list.component';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.scss']
})
export class CategoryModalComponent {

  @Input() show: boolean = false;
  @Input() selectedCategories: CategoryResponse[] = [];
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() categorySelectedEvent = new EventEmitter<CategoryResponse[]>();

  errorMessage: string = '';

  closeModal(): void {
    this.closeModalEvent.emit();
  }

  handleCategoryChange(selectedCategories: CategoryResponse[]): void {
    console.log('Categorías seleccionadas:', selectedCategories);

    if (selectedCategories.length > 3) {
      this.selectedCategories = selectedCategories.slice(0, 3);
      this.errorMessage = 'Solo puedes seleccionar hasta 3 categorías';
    } else {
      this.errorMessage = '';
      this.selectedCategories = selectedCategories;
    }
    this.categorySelectedEvent.emit(this.selectedCategories);
  }

  acceptSelection(): void {
    if (this.selectedCategories.length >= 1 && this.selectedCategories.length <= 3) {
      this.closeModal();
    } else {
      this.errorMessage = 'Selecciona entre 1 y 3 categorías.';
    }
  }

  getCategoryName(categoryId: number): string {
    const category = this.selectedCategories.find(cat => cat.categoryId === categoryId);
    return category ? category.categoryName : 'Categoría ';
  }
}
