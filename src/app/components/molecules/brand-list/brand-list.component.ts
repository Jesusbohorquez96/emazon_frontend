import { Component, OnInit } from '@angular/core';
import { BrandResponse } from 'src/app/models/brands.models';
import { BrandService } from '../../../services/brand.service';

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.scss']
})
export class BrandListComponent implements OnInit {
  fields: any;

  brands: BrandResponse[] = []; 
  columns = [
    { field: 'brandId', header: 'Id' },
    { field: 'brandName', header: 'Nombre' },
    { field: 'brandDescription', header: 'Descripción' }
  ];
  page: number = 0;
  size: number = 4;
  sortBy: string = 'NAME';
  sortDirection: string = 'ASC';
  totalPages: number = 0;
  searchName: string = '';

  constructor(private readonly brandService: BrandService) { }

  ngOnInit(): void {
    this.getBrands(); 
  }

  getBrands() {
    this.brandService.getBrands(this.page, this.size, this.sortBy, this.sortDirection, this.searchName).subscribe(
      (response) => {
        console.log('Respuesta de la API:', response);
        this.brands = response.content || response; 
        this.totalPages = response.totalPages || 0;
      },
      (error) => {
        console.error('Error al obtener las marcas:', error); 
      }
    );
  }

  toggleSort() {
    this.sortDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
    this.getBrands(); 
  }

  updatePageSize() {
    this.page = 0;
    this.getBrands(); 
  }

  searchByName() {
    this.page = 0;
    this.getBrands(); 
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.getBrands(); 
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.page = page;
      this.getBrands(); 
    }
  }

  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.getBrands(); 
    }
  }

  prevPage() {
    if (this.page > 0) {
      this.page--;
      this.getBrands(); 
    }
  }
}
