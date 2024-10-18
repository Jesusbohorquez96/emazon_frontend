import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BrandService } from '../../../../services/brand.service';
import { HttpStatusCode } from '@angular/common/http';
import { APP_CONSTANTS } from '@/styles/constants';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    private readonly brandService: BrandService,
    private readonly toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.brandForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(90)]),
    });
  }

  saveBrand() {
    if (this.brandForm && this.brandForm.invalid) {
      this.status = APP_CONSTANTS.ERROR;
      this.errorMessage = APP_CONSTANTS.ERRORS.CORRECT;
      this.toastr.error(this.errorMessage);
      this.resetStatusAfterTimeout();
      return;
    }

    const brandData = this.brandForm ? this.brandForm.value : {};

    this.brandService.saveBrand(brandData).subscribe(
      (response) => {
        console.log(APP_CONSTANTS.ERRORS.SAVED_MARCA, response);
        this.status = APP_CONSTANTS.ERRORS.SUCCESS;
        this.toastr.success('Marca creada con éxito.');
        this.resetForm();
        this.resetStatusAfterTimeout();
      },
      (error) => {
        console.error(APP_CONSTANTS.ERRORS.ERROR_MARCA, error);
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
    }, APP_CONSTANTS.NUMBER.TIMEOUT_MS);
  }
}
