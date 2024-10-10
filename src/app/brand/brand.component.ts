import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BrandResponse } from './models/brands.models';
import { BrandService } from '@/app/services/brand.service';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements OnInit {

  brands: BrandResponse[] = [];
  brandForm!: FormGroup;

  page: number = 0;
  size: number = 1;
  sortBy: string = 'NAME';
  sortDirection: string = 'ASC';
  totalPages: number = 0;
  searchName: string = '';
  status: string = '';
  statusTimeout: any;
  errorMessage: string = '';

  constructor(private readonly brandService: BrandService) { }

  ngOnInit(): void {
    this.getBrands();

    this.brandForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(90)]),
    });
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

  saveBrand() {
    if (this.brandForm && this.brandForm.invalid) {
      this.status = 'error';
      this.errorMessage = 'Corrige los errores del formulario.';
      this.resetStatusAfterTimeout();
      return;
    }

    const brandData = this.brandForm.value;

    this.brandService.saveBrand(brandData).subscribe(
      (response) => {
        console.log('Saved Brand:', response);
        this.status = 'success';
        this.getBrands();
        this.resetForm();
        this.resetStatusAfterTimeout();
      },
      (error) => {
        console.error('Error al guardar la marca:', error);
        let errorMessage = 'Ocurrió un error al guardar.';

        if (error.status === HttpStatusCode.InternalServerError) {
          if (error.error && error.error.message) {
            errorMessage = 'Error en los datos ingresados.';
          }
        }
        if (error.status === HttpStatusCode.Conflict) {
          errorMessage = 'Nombre ya en uso, elige otro.';
        }

        this.status = 'error';
        this.errorMessage = errorMessage;
        this.resetStatusAfterTimeout();
      }
    );
  }

  resetForm() {
    this.brandForm.reset();
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
    this.getBrands();
  }

  toggleSort() {
    this.sortDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
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
