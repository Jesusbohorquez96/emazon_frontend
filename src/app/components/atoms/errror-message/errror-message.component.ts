import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { APP_CONSTANTS } from '@/styles/constants';

@Component({
  selector: 'app-error-message',
  template: `
    <div *ngIf="control?.touched && control?.errors" class="error-message">
      <small *ngIf="control?.hasError('required')"> {{ requiredMessage }} </small>
      <small *ngIf="control?.hasError('maxlength')"> {{ maxLengthMessage }} </small>
      <small *ngIf="control?.hasError('min')">{{ minMessage }}</small>
      <small *ngIf="control?.hasError('minlength')">{{ minLengthMessage }}</small>
      <small *ngIf="control?.hasError('pattern')">{{ patternMessage }}</small>
    </div>
  `
})
export class ErrorMessageComponent {
  
  @Input() control: AbstractControl | null = null;
  @Input() requiredMessage: string = APP_CONSTANTS.MESSAGE.FIELD; 
  @Input() minMessage: string = 'El precio mínimo permitido es de 1000 pesos.';
  @Input() maxLengthMessage: string = APP_CONSTANTS.MESSAGE.MAX; 
  @Input() minLengthMessage: string = APP_CONSTANTS.MESSAGE.MIN; 
  @Input() patternMessage: string = APP_CONSTANTS.MESSAGE.PATTERN; 

}
