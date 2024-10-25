import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerPageRoutingModule } from './customer-page-routing.module';
import { CustomerModule } from '@/app/modules/user/customer/customer.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CustomerPageRoutingModule,
    CustomerModule
  ]
})
export class CustomerPageModule { }
