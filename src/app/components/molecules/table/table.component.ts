import { APP_CONSTANTS } from '@/styles/constants';
import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent<T> implements OnChanges {
  
  @Input() selectedEnabled: boolean = false;
  @Input() columns: { field: string, header: string }[] = [];
  @Input() data: any[] = [];
  @Input() selectedItems: any[] = [];
  @Output() selectedChangue = new EventEmitter<any[]>();
  dataSelected: any[] = [];

  columnCheckbox = { field: APP_CONSTANTS.CHECKBOX.FIELD, header: APP_CONSTANTS.CHECKBOX.HEADER };

  ngOnInit(): void {
    if (this.selectedEnabled) {
      this.updateDataSelection();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      console.log('Data has changed:', changes['data'].currentValue);
      this.updateDataSelection(); 
    }

    if (changes['selectedItems']) {
      console.log('SelectedItems has changed:', changes['selectedItems'].currentValue);
      this.updateDataSelection(); 
    }
  }

  updateDataSelection(): void {
    console.log('Updating data selection', this.data, this.selectedItems);
    if (this.selectedEnabled) {

      this.data = this.data.map((item, index) => {
        const selected = this.isSelected(item);
        this.dataSelected[index] = selected;
        return { ...item };
      });
    }
  }

  isSelected(row: any): boolean {
    return this.selectedItems.some(selected => JSON.stringify(selected) === JSON.stringify(row));
  }

  onRowSelectionChange(row: any, event: Event): void {
    if (this.selectedEnabled) {
      const selected = (event.target as HTMLInputElement).checked;

      this.selectedItems = this.selectedItems.filter(item => JSON.stringify(item) !== JSON.stringify(row));

      if (selected) {
        this.selectedItems.push(row);
      }
      delete row.selected;
      this.selectedChangue.emit(this.selectedItems); 
    }
  }
}
