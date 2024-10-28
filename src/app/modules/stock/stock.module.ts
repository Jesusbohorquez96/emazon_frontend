import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AtomsModule } from "../../components/atoms/atoms.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StockIncrementModalComponent } from './stock-increment.modal/stock-increment.modal.component';
import { StockComponent } from './stock.component';

@NgModule({
  declarations: [
    StockComponent,
    StockIncrementModalComponent
  ],
  imports: [
    CommonModule,
    AtomsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    StockComponent,
    StockIncrementModalComponent,
  ]
})
export class StockModule { }
