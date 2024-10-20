import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrandCreateComponent } from './brand-create/brand-create.component';
import { BrandListComponent } from './brand-list/brand-list.component';
import { BrandModalComponent } from './brand-modal/brand-modal.component';
import { BrandComponent } from 'src/app/components/pages/brand/brand.component';
import { SharedModule } from '../../atoms/shared.module';

@NgModule({
  declarations: [
    BrandCreateComponent,
    BrandListComponent,
    BrandModalComponent,
    BrandComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    BrandComponent,
    BrandCreateComponent,
    BrandListComponent,
    BrandModalComponent,
  ]
})
export class BrandsModule { }
