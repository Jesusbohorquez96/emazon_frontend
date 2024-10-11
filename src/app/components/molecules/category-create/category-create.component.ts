import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-category-create',
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.scss']
})
export class CategoryCreateComponent implements OnInit {

  categoryForm!: FormGroup;
  status: string = '';
  statusTimeout: any;
  errorMessage: string = '';

  constructor(private readonly categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(90)]),
    });
  }

  saveCategory() {
    if (this.categoryForm && this.categoryForm.invalid) {
      this.status = 'error';
      this.errorMessage = 'Corrige los errores del formulario.';
      this.resetStatusAfterTimeout();
      return;
    }

    const categoryData = this.categoryForm ? this.categoryForm.value : {};

    this.categoryService.saveCategory(categoryData).subscribe(
      (response) => {
        console.log('Saved Category:', response);
        this.status = 'success';
        this.resetForm();
        this.resetStatusAfterTimeout();
      },
      (error) => {
        console.error('Error al guardar la categoría:', error);
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
    this.categoryForm.reset();
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
