import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SuppliesService } from '@/app/services/supplies.service';
import { ToastrService } from 'ngx-toastr';
import { HttpStatusCode } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-stock-increment',
  templateUrl: './stock-increment.modal.component.html',
  styleUrls: ['./stock-increment.modal.component.scss']
})
export class StockIncrementModalComponent {

  stockForm!: FormGroup;
  responseMessage: string = '';

  constructor(
    private readonly supplyService: SuppliesService,
    private readonly toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.stockForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      quantity: new FormControl('', [Validators.required, Validators.min(1)]),
      status: new FormControl('nuevo', [Validators.required]),
      articleId: new FormControl('', [Validators.required, Validators.min(1)])
    });
  }

  updateStock() {
    if (this.stockForm.invalid) {
      this.toastr.error('Por favor completa todos los campos requeridos correctamente.');
      return;
    }

    const stockData = this.stockForm.value;

    this.supplyService.updateStock(stockData).pipe(
      tap(response => {
        this.responseMessage = 'Stock actualizado correctamente';
        this.toastr.success(this.responseMessage);
        this.resetForm();
      }),
      catchError(error => {
        console.error('Error al actualizar el stock:', error);
        let errorMessage = 'Ocurrió un error al actualizar el stock.';

        if (error.status === HttpStatusCode.InternalServerError) {
          errorMessage = 'Hubo un problema en el servidor. Intenta de nuevo más tarde.';
        } else if (error.status === HttpStatusCode.Conflict) {
          errorMessage = 'El stock ya existe o hay un conflicto en la operación.';
        }

        this.responseMessage = errorMessage;
        this.toastr.error(this.responseMessage);
        return of(null);
      })
    ).subscribe();
  }

  resetForm() {
    this.stockForm.reset({
      name: '',
      quantity: 0,
      status: 'nuevo',
      articleId: null
    });
  }
}