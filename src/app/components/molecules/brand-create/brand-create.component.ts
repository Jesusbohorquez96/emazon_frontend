import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BrandService } from '../../../services/brand.service'; 
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-brand-create',
  templateUrl: './brand-create.component.html',
  styleUrls: ['./brand-create.component.scss']
})
export class BrandCreateComponent implements OnInit {

  brandForm!: FormGroup;
  status: string = '';
  statusTimeout: any;
  errorMessage: string = '';

  constructor(private readonly brandService: BrandService) { } 

  ngOnInit(): void {
    this.brandForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(90)]),
    });
  }

  saveBrand() {
    if (this.brandForm && this.brandForm.invalid) {
      this.status = 'error';
      this.errorMessage = 'Corrige los errores del formulario.';
      this.resetStatusAfterTimeout();
      return;
    }

    const brandData = this.brandForm ? this.brandForm.value : {};

    this.brandService.saveBrand(brandData).subscribe( 
      (response) => {
        console.log('Saved Brand:', response);
        this.status = 'success';
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
}
