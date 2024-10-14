import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { APP_CONSTANTS } from '@/styles/constants';

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
  @Input() requiredMessage: string = APP_CONSTANTS.MESSAGE.FIELD; 
  @Input() maxLengthMessage: string = APP_CONSTANTS.MESSAGE.MAX; 
}
