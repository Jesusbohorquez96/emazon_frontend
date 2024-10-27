import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '@/app/services/customer.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, of, tap } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';
import { Router } from '@angular/router';
import { APP_CONSTANTS } from '@/styles/constants';

@Component({
  selector: 'app-customer-create',
  templateUrl: './customer-create.component.html',
  styleUrls: ['./customer-create.component.scss']
})
export class CustomerCreateComponent implements OnInit {

  registerForm!: FormGroup | any;
  status: string = '';
  statusTimeout: any;
  errorMessage: string = '';
  messageError?: string;
  requiredMessage: any;
  patternMessage: any;
  numberMessage: any;

  constructor(
    private readonly toastr: ToastrService,
    private readonly customerService: CustomerService,
    private readonly router: Router
  ) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(50)
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.maxLength(50)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@(gmail|hotmail|yahoo|outlook)\.com|co|go$/)
      ]),
      idDocument: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{7,12}$/),
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\+\d{7,13}$/),
      ]),
      birthdate: new FormControl('', [
        Validators.required,
        this.dateValidator
      ]), 
    });
  }

  validateNumberInput(event: KeyboardEvent) {
    const charCode = event.charCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  allowOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = event.charCode;
    return (charCode >= 48 && charCode <= 57) || charCode === 43;
  }

  dateValidator(control: any) {
    const inputDate = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - inputDate.getFullYear();
    const isAdult = age > 18 || (age === 18 && today >= new Date(inputDate.setFullYear(inputDate.getFullYear() + 18)));
    return isAdult ? null : { notAdult: true };
  }

  saveCustomer() {
    if (this.registerForm.invalid) {
      this.status = 'error';
      this.errorMessage = 'Corrige los errores del formulario.';
      this.toastr.error(this.errorMessage);
      this.resetStatusAfterTimeout();
      return;
    }

    const customerData = this.registerForm.value;

    this.customerService.saveUsers(customerData).pipe(
      tap((response) => {
        console.log('Customer saved:', response);
        this.status = 'success';
        this.toastr.success('Cliente registrado con éxito.');

        this.resetForm();
        this.resetStatusAfterTimeout();

        this.router.navigate([APP_CONSTANTS.lOGIN]);  
      }),
      catchError((error) => {
        console.error('Error al registrar el cliente:', error);
        let errorMessage = 'Ocurrió un error al registrar el cliente.';

        if (error.status === HttpStatusCode.InternalServerError) {
          errorMessage = 'Error interno del servidor.';
        } else if (error.status === HttpStatusCode.Conflict) {
          errorMessage = 'El nombre de usuario ya está en uso.';
        }

        this.status = 'error';
        this.errorMessage = errorMessage;
        this.toastr.error(this.errorMessage);
        this.resetStatusAfterTimeout();

        return of(null);
      })
    ).subscribe();
  }

  resetForm() {
    this.registerForm.reset();
  }

  resetStatusAfterTimeout() {
    if (this.statusTimeout) {
      clearTimeout(this.statusTimeout);
    }
    this.statusTimeout = setTimeout(() => {
      this.status = '';
      this.errorMessage = '';
    }, 5000);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
