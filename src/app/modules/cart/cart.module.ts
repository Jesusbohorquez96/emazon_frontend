import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartCreateComponent } from './cart-create/cart-create.component';
import { AtomsModule } from '@/app/components/atoms/atoms.module';

@NgModule({
  declarations: [
    CartComponent,
    CartCreateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AtomsModule 
    
  ],
  exports: [
    CartComponent,
    CartCreateComponent
  ]
})
export class CartModule { }
