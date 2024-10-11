import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {

  @Input() errorMessage: string | undefined;
  @Input() isDisabled: boolean = false;
  @Input() label: string = 'Guardar';
  @Input() status: string = '';
  @Input() buttonForm!: FormGroup;

};


