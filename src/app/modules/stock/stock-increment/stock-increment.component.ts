import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SuppliesService } from '@/app/services/supplies.service';
import { ToastrService } from 'ngx-toastr';
import { HttpStatusCode } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-stock-increment',
  templateUrl: './stock-increment.component.html',
  styleUrls: ['./stock-increment.component.scss']
})
export class StockIncrementComponent implements OnInit, OnChanges {

  @Input() articleId!: number;
  @Input() articleName!: string;
  @Input() allowEdit: boolean = true;

  stockForm!: FormGroup;
  responseMessage: string = '';

  constructor(
    private readonly supplyService: SuppliesService,
    private readonly toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateFormValuesOnChanges(changes);
  }

  private initializeForm(): void {
    this.stockForm = new FormGroup({
      articleId: new FormControl(this.articleId, [Validators.required, Validators.min(1)]),
      name: new FormControl(this.articleName, [Validators.required]),
      quantity: new FormControl('', [Validators.required, Validators.min(1)]),
      status: new FormControl('nuevo', [Validators.required])
    });
  }

  private updateFormValuesOnChanges(changes: SimpleChanges): void {
    if (changes['articleId'] && !changes['articleId'].isFirstChange()) {
      this.stockForm.get('articleId')?.setValue(this.articleId);
    }
    if (changes['articleName'] && !changes['articleName'].isFirstChange()) {
      this.stockForm.get('name')?.setValue(this.articleName);
    }
  }

  updateStock(): void {
    if (this.stockForm.invalid) {
      return;
    }

    const stockData = this.stockForm.getRawValue();
    this.supplyService.updateStock(stockData).pipe(
      tap(() => this.handleSuccessResponse()),
      catchError(error => this.handleErrorResponse(error))
    ).subscribe();
  }

  private handleSuccessResponse(): void {
    this.responseMessage = 'Stock actualizado correctamente';
    this.toastr.success(this.responseMessage);
    this.resetForm();
  }

  private handleErrorResponse(error: any) {
    const errorMessage = this.getErrorMessage(error);
    this.responseMessage = errorMessage;
    this.toastr.error(this.responseMessage);
    return of(null);
  }

  private getErrorMessage(error: any): string {
    if (error.status === HttpStatusCode.InternalServerError) {
      return 'Hubo un problema en el servidor. Intenta de nuevo más tarde.';
    } else if (error.status === HttpStatusCode.Conflict) {
      return 'El stock ya existe o hay un conflicto en la operación.';
    }
    return 'Ocurrió un error al actualizar el stock.';
  }

  private resetForm(): void {
    this.stockForm.reset({
      articleId: this.articleId,
      name: this.articleName,
      quantity: null,
      status: 'nuevo'
    });
  }
}
