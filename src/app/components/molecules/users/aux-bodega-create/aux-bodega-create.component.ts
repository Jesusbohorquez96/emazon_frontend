import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { auxBodegaService } from '@/app/services/aux-bodega.service';

@Component({
  selector: 'app-aux-bodega-create',
  templateUrl: './aux-bodega-create.component.html',
  styleUrls: ['./aux-bodega-create.component.scss']
})
export class AuxBodegaCreateComponent {

  registerForm: FormGroup;
  errorMessage!: string;

  constructor(
    private fb: FormBuilder,
    private auxBodegaService: auxBodegaService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.maxLength(50)
      ]],
      lastName: ['', [
        Validators.required,
        Validators.maxLength(50)
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      email: ['', [Validators.required, Validators.email]],
      idDocument: ['', [
        Validators.required,
        Validators.pattern(/^\d+$/)
      ]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^\+?\d{7,13}$/) 
      ]],
      birthdate: ['', [
        Validators.required,
        this.dateValidator
      ]],
      rol: ['', [Validators.required]]
    });
  }
  dateValidator(control: any) {
    const inputDate = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - inputDate.getFullYear();
    const isAdult = age > 18 || (age === 18 && today >= new Date(inputDate.setFullYear(inputDate.getFullYear() + 18)));
    return isAdult ? null : { notAdult: true };
  }

  register() {
    if (this.registerForm.valid) {
      const user = this.registerForm.value;
      this.auxBodegaService.saveUsers(
        user.name,
        user.lastName,
        user.password,
        user.email,
        user.idDocument,
        user.phone,
        user.birthdate,
        user.rol
      ).subscribe(
        (        response: any) => {
          console.log('Usuario registrado', response);
        },
        (        error: any) => {
          console.error('Error al registrar usuario', error);
        }
      );
    } else {
      console.log('Formulario no válido');
    }
  }
}
