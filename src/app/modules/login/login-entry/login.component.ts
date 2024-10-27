import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../../services/login.service';
import { HttpStatusCode } from '@angular/common/http';
import { APP_CONSTANTS } from '@/styles/constants';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { VisibilityService } from '@/app/services/visibility.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup | any;
  status: string = '';
  statusTimeout: any;
  errorMessage: string = '';
  messageError?: string;
  registerForm: any;

  constructor(
    private readonly fb: FormBuilder,
    private readonly loginService: LoginService,
    public readonly toastr: ToastrService,
    public readonly router: Router,
    private readonly visibilityService: VisibilityService
  ) { }

  ngOnInit(): void {
    this.visibilityService.hideNavbar();
    this.visibilityService.hideFooter();

    this.loginForm = this.fb.group({
      email: ['', [Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@(gmail|hotmail|yahoo|outlook)\.com|co|go$/)]],
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&+#-])[A-Za-z\d@$!%*#?&+-]{8,}$/)
      ]]
    });
  }

  saveLogin() {
    if (this.loginForm.invalid) {
      this.status = APP_CONSTANTS.ERROR;
      this.errorMessage = APP_CONSTANTS.ERRORS.CORRECT;
      this.toastr.error(this.errorMessage);
      this.resetStatusAfterTimeout();
      return;
    }

    const { email, password } = this.loginForm.value;

    this.loginService.saveLogin(email, password).pipe(
      tap((response: any) => {
        const token = response.token;
        const user = response.user;

        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));

        this.status = APP_CONSTANTS.ERRORS.SUCCESS;
        this.toastr.success('Has iniciado sesión correctamente.');
        this.resetForm();
        this.resetStatusAfterTimeout();

        this.loginService.setAuthStatus(true);
        this.router.navigate([APP_CONSTANTS.HOME]).then(() => {
          window.location.reload();
        });
      }),
      catchError((error: any) => {
        let errorMessage = APP_CONSTANTS.ERRORS.INCOME;

        if (error.status === HttpStatusCode.Unauthorized) {
          errorMessage = 'Error en el servidor. Por favor, intenta más tarde.';
        }

        if (error.status === HttpStatusCode.InternalServerError) {
          errorMessage = 'Credenciales incorrectas. Verifica tu email y contraseña.';
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
    this.loginForm.reset();
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

  goToRegister() {
    this.router.navigate(['/cliente']);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}