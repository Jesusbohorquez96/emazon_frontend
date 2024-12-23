import { Component, Input, Output, EventEmitter  } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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
  @Input() buttonType: 'primary' | 'secondary' = 'primary';
  @Output() action = new EventEmitter<void>();

  constructor( private readonly toastr: ToastrService ) { }

  onClick() {
    if (this.buttonForm.invalid) {
      this.toastr.error('El formulario tiene errores. Por favor, revisa los campos.');
      return;
    }

    if (this.status === 'error' && this.errorMessage) {
      this.toastr.error(this.errorMessage, '', {
        positionClass: 'toast-top-right' 
    });
    }
    else if (this.status === 'success') {
      this.toastr.success(this.errorMessage, '', {
        positionClass: 'toast-top-right'
      });
    }
    this.action.emit();
  }
}