import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockPageRoutingModule } from './stock-page-routing.module';
import { StockModule } from '@/app/modules/stock/stock.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    StockPageRoutingModule,
    StockModule,
  ]
})
export class StockPageModule { }
