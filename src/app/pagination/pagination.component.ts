import { Component, Input, Output, EventEmitter } from '@angular/core';
import { APP_CONSTANTS } from 'src/styles/constants';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  
  @Input() page: number = APP_CONSTANTS.NUMBER.ZERO;
  @Input() totalPages: number = APP_CONSTANTS.NUMBER.ZERO; 
  @Output() pageChange = new EventEmitter<number>(); 

  prevPage() {
    if (this.page > APP_CONSTANTS.NUMBER.ZERO) {
      this.pageChange.emit(this.page - APP_CONSTANTS.NUMBER.ONE);
    }
  }

  nextPage() {
    if (this.page < this.totalPages - APP_CONSTANTS.NUMBER.ONE) {
      this.pageChange.emit(this.page + APP_CONSTANTS.NUMBER.ONE);
    }
  }

  goToPage(page: number) {
    this.pageChange.emit(page);
  }
}
