import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerComponent } from './customer.component';
import { CustomerCreateComponent } from './customer-create/customer-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AtomsModule } from '@/app/components/atoms/atoms.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    CustomerComponent,
    CustomerCreateComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AtomsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    CustomerComponent,
    CustomerCreateComponent,
  ]
})
export class CustomerModule { }
