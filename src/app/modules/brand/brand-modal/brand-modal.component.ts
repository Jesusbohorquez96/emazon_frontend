import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BrandResponse } from 'src/app/models/brand.model';

@Component({
  selector: 'app-brand-modal',
  templateUrl: './brand-modal.component.html',
  styleUrls: ['./brand-modal.component.scss']
})
export class BrandModalComponent {

  @Input() show: boolean = false;
  @Input() selectedBrands: BrandResponse[] = [];
  @Input() selectedBrand: BrandResponse | null = null;

  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() brandSelectedEvent = new EventEmitter<BrandResponse[]>(); 

  errorMessageB: string = '';

  closeModal(): void {
    this.selectedBrands = [];
    this.selectedBrand = null;
    this.errorMessageB = '';
    this.closeModalEvent.emit();
  }

  handleBrandChange(selectedBrands: BrandResponse[]): void {
    console.log('Marcas seleccionadas:', selectedBrands);

    if (selectedBrands.length > 1) {
      this.errorMessageB = 'Solo puedes seleccionar una 1 marca';
      this.selectedBrands = selectedBrands.slice(0, 1);
      return;
    }

    this.errorMessageB = '';
    this.selectedBrands = selectedBrands; 
    this.brandSelectedEvent.emit(this.selectedBrands); 
  }

  acceptSelection(): void {
    if (this.selectedBrands.length === 1) {
      this.brandSelectedEvent.emit(this.selectedBrands); 
      this.closeModal();
    } else {
      this.errorMessageB = 'Por favor, selecciona una marca.';
    }
  }

  getBrandName(brandId: number): string {
    const brand = this.selectedBrands.find(b => b.brandId === brandId);
    return brand ? brand.brandName : 'Marca ';
  }
}
