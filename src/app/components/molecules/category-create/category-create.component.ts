import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { HttpStatusCode } from '@angular/common/http';
import { APP_CONSTANTS } from '@/styles/constants';


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
      name: new FormControl('', [Validators.required, Validators.maxLength(APP_CONSTANTS.NUMBER.NAME_LENGTH)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(APP_CONSTANTS.NUMBER.DESCRIPTION_LENGTH)]),
    });
  }

  saveCategory() {
    if (this.categoryForm && this.categoryForm.invalid) {
      this.status = APP_CONSTANTS.ERROR;
      this.errorMessage = APP_CONSTANTS.ERRORS.CORRECT;
      this.resetStatusAfterTimeout();
      return;
    }

    const categoryData = this.categoryForm ? this.categoryForm.value : {};

    this.categoryService.saveCategory(categoryData).subscribe(
      (response) => {
        console.log(APP_CONSTANTS.ERRORS.SAVED, response);
        this.status = APP_CONSTANTS.ERRORS.SUCCESS;
        this.resetForm();
        this.resetStatusAfterTimeout();
      },
      (error) => {
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
    }, APP_CONSTANTS.NUMBER.TIMEOUT_MS);
  }
}
