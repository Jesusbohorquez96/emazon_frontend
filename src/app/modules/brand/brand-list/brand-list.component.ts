import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Brand, BrandResponse } from '@/app/models/brand.model';
import { BrandService } from '../../../services/brand.service';
import { APP_CONSTANTS } from '@/styles/constants';
import { RoleService } from '@/app/services/role.service';

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.scss']
})
export class BrandListComponent implements OnInit {

  @Input() selectedEnabled: boolean = false;
  @Input() showTitle: boolean = true;
  @Input() showLabel: boolean = true;
  @Input() showPageSizeControl: boolean = true;
  @Input() selectedBrands: BrandResponse[] = [];
  @Input() columns: { field: string, header: string }[] = [
    { field: APP_CONSTANTS.BRAND.NAME, header: APP_CONSTANTS.SPANISH.NAME },
    { field: APP_CONSTANTS.BRAND.DESCRIPTION, header: APP_CONSTANTS.SPANISH.DESCRIPTION },
  ];
  @Output() brandsSelected = new EventEmitter<BrandResponse[]>();

  brands: Brand[] = [];

  page: number = APP_CONSTANTS.PAGINATION.ZERO;
  size: number = APP_CONSTANTS.NUMBER.MAX_RETRIES;
  sortBy: string = APP_CONSTANTS.PAGINATION.NAME;
  sortDirection: string = APP_CONSTANTS.PAGINATION.ASC;
  totalPages: number = APP_CONSTANTS.PAGINATION.ZERO;
  searchName: string = '';

  constructor(private readonly brandService: BrandService,
    public roleService: RoleService
  ) { }

  ngOnInit(): void {
    this.loadBrands();
    this.getBrands();
  }

  getBrands() {
    console.log('Parámetros enviados a la API:', this.page, this.size, this.sortBy, this.sortDirection, this.searchName);

    this.brandService.getBrands(this.page, this.size, this.sortBy, this.sortDirection, this.searchName).subscribe(
      (response) => {
        console.log('Respuesta de marcas desde la API:', response);
        this.brands = response.content || response;
        this.totalPages = response.totalPages || APP_CONSTANTS.PAGINATION.ZERO;
      },
      (error) => {
        console.error('Error al obtener marcas:', error);
      }
    );
  }

  handleBrandChange(Brand: BrandResponse[]) {
    this.brandsSelected.emit(Brand);
  }

  loadBrands(): void {
    this.brandService.getBrands(0, 3, 'NAME', 'ASC', '').subscribe((response: any) => {
      this.brands = response.content;
    });
  }

  toggleSort() {
    this.sortDirection = this.sortDirection === APP_CONSTANTS.PAGINATION.ASC ? APP_CONSTANTS.PAGINATION.DESC : APP_CONSTANTS.PAGINATION.ASC;
    this.getBrands();
  }

  updatePageSize(): void {
    if (this.size < 1) {
      this.size = 1;
    } else if (this.size > 10) {
      this.size = 10;
    }
    this.page = 0;
    this.search();
  }
  search() {
  }

  searchByName() {
    this.page = APP_CONSTANTS.PAGINATION.ZERO;
    this.getBrands();
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.getBrands();
  }

  goToPage(page: number) {
    if (page >= APP_CONSTANTS.PAGINATION.ZERO && page < this.totalPages) {
      this.page = page;
      this.getBrands();
    }
  }

  nextPage() {
    if (this.page < this.totalPages - APP_CONSTANTS.NUMBER.ONE) {
      this.page++;
      this.getBrands();
    }
  }

  prevPage() {
    if (this.page > APP_CONSTANTS.PAGINATION.ZERO) {
      this.page--;
      this.getBrands();
    }
  }
}
