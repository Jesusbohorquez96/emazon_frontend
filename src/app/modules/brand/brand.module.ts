import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandCreateComponent } from './brand-create/brand-create.component';
import { BrandListComponent } from './brand-list/brand-list.component';
import { BrandModalComponent } from './brand-modal/brand-modal.component';
import { BrandComponent } from '@/app/pages/brand-page/brand/brand.component';
import { AtomsModule } from '@/app/components/atoms/atoms.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BrandCreateComponent,
    BrandListComponent,
    BrandModalComponent,
    BrandComponent,
  ],
  imports: [
    CommonModule,
    AtomsModule,
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
export class BrandModule { }
