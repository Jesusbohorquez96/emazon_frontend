import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { HttpStatusCode } from '@angular/common/http';
import { APP_CONSTANTS } from '@/styles/constants';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

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
  messageError?: string;

  constructor(
    private readonly categoryService: CategoryService,
    private readonly toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.categoryForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(APP_CONSTANTS.NUMBER.NAME_LENGTH)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(APP_CONSTANTS.NUMBER.DESCRIPTION_LENGTH)]),
    });
  }

  saveCategory() {
    if (this.categoryForm && this.categoryForm.invalid) {
      this.status = APP_CONSTANTS.ERROR;
      this.errorMessage = APP_CONSTANTS.ERRORS.CORRECT;
      this.toastr.error(this.errorMessage);
      this.resetStatusAfterTimeout();
      return;
    }

    const categoryData = this.categoryForm ? this.categoryForm.value : {};

    this.categoryService.saveCategory(categoryData).pipe(
      tap((response) => {
        console.log(APP_CONSTANTS.ERRORS.SAVED, response);
        this.status = APP_CONSTANTS.ERRORS.SUCCESS;
        this.toastr.success('Categoría creada con éxito.');
        this.resetForm();
        this.resetStatusAfterTimeout();
      }),
      catchError((error) => {
        console.error(APP_CONSTANTS.ERRORS.ERROR, error);
        let errorMessage = APP_CONSTANTS.ERRORS.OCCURRED;

        if (error.status === HttpStatusCode.InternalServerError) {
          if (error.error && error.error.message) {
            errorMessage = APP_CONSTANTS.ERRORS.DATA;
          }
        }

        if (error.status === HttpStatusCode.Conflict) {
          errorMessage = APP_CONSTANTS.ERRORS.USE;
        }

        this.status = APP_CONSTANTS.ERROR;
        this.errorMessage = errorMessage;
        this.toastr.error(this.errorMessage);
        this.resetStatusAfterTimeout();

        return of(null);
      })
    ).subscribe();
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
      this.errorMessage = '';
    }, APP_CONSTANTS.NUMBER.TIMEOUT_MS);
  }
}
