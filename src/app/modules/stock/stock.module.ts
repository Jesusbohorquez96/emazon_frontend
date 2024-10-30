import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AtomsModule } from "../../components/atoms/atoms.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StockIncrementComponent } from './stock-increment/stock-increment.component';
import { StockComponent } from './stock.component';

@NgModule({
  declarations: [
    StockComponent,
    StockIncrementComponent,
  ],
  imports: [
    CommonModule,
    AtomsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    StockComponent,
    StockIncrementComponent,
  ]
})
export class StockModule { }
