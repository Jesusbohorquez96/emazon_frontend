import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-error-message',
  template: `
    <div *ngIf="control?.touched && control?.errors" class="error-message">
      <small *ngIf="control?.hasError('required')"> {{ requiredMessage }} </small>
      <small *ngIf="control?.hasError('maxlength')"> {{ maxLengthMessage }} </small>
    </div>
  `
})
export class ErrorMessageComponent {
  @Input() control: AbstractControl | null = null;
  @Input() requiredMessage: string = 'Este campo es requerido.'; 
  @Input() maxLengthMessage: string = 'Excede el número máximo de caracteres.'; 
}
