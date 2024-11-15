import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartCreateComponent } from './cart-create/cart-create.component';
import { AtomsModule } from '@/app/components/atoms/atoms.module';
import { CartListComponent } from './cart-list/cart-list.component';

@NgModule({
  declarations: [
    CartComponent,
    CartCreateComponent,
    CartListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AtomsModule 
  ],
  exports: [
    CartComponent,
    CartCreateComponent,
    CartListComponent
  ]
})
export class CartModule { }
