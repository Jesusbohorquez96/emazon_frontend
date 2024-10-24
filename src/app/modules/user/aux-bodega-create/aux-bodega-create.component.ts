import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { auxBodegaService } from '@/app/services/aux-bodega.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, of, tap } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';
import { Router } from '@angular/router';
import { APP_CONSTANTS } from '@/styles/constants';

@Component({
  selector: 'app-aux-bodega-create',
  templateUrl: './aux-bodega-create.component.html',
  styleUrls: ['./aux-bodega-create.component.scss']
})
export class AuxBodegaCreateComponent implements OnInit {

  registerForm!: FormGroup;
  status: string = '';
  statusTimeout: any;
  errorMessage: string = '';
  messageError?: string;
  requiredMessage: any;
  patternMessage: any;
  numberMessage: any;

  constructor(
    public toastr: ToastrService,
    private readonly auxBodegaService: auxBodegaService,
    public router: Router
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
        Validators.email]),
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
      rol: new FormControl('', [Validators.required])
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

    if ((charCode >= 48 && charCode <= 57) || charCode === 43) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  dateValidator(control: any) {
    const inputDate = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - inputDate.getFullYear();
    const isAdult = age > 18 || (age === 18 && today >= new Date(inputDate.setFullYear(inputDate.getFullYear() + 18)));
    return isAdult ? null : { notAdult: true };
  }

  saveUsers() {
    if (this.registerForm && this.registerForm.invalid) {
      this.status = 'error';
      this.errorMessage = 'Corrige los errores del formulario.';
      this.toastr.error(this.errorMessage);
      this.resetStatusAfterTimeout();
      return;
    }

    const UsersData = this.registerForm ? this.registerForm.value : {};

    this.auxBodegaService.saveUsers(UsersData).pipe(
      tap((response) => {
        console.log('Saved aux bodega:', response);
        this.status = 'success';
        this.toastr.success('aux bodega creada con éxito.');

        this.resetForm();
        this.resetStatusAfterTimeout();

        this.router.navigate([APP_CONSTANTS.lOGIN]);
      }),
      catchError((error) => {
        console.error('Error al guardar la aux bodega:', error);
        let errorMessage = 'Ocurrió un error al guardar.';

        if (error.status === HttpStatusCode.InternalServerError) {
          if (error.error && error.error.message) {
            errorMessage = 'Ususario no autorizado.';
          }
        }

        if (error.status === HttpStatusCode.Conflict) {
          errorMessage = 'Nombre ya en uso, elige otro.';
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
