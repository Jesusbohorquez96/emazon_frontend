import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() page: number = 0;
  @Input() totalPages: number = 0; 

  @Output() pageChange = new EventEmitter<number>(); 

  prevPage() {
    if (this.page > 0) {
      this.pageChange.emit(this.page - 1);
    }
  }

  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.pageChange.emit(this.page + 1);
    }
  }

  goToPage(page: number) {
    this.pageChange.emit(page);
  }
}
