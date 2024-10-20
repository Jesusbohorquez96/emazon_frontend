import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CategoryCreateComponent } from './category-create/category-create.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryModalComponent } from './category-modal/category-modal.component';
import { CategoryComponent } from 'src/app/components/pages/category/category.component';

import { SharedModule } from '../../atoms/shared.module';

@NgModule({
  declarations: [
    CategoryListComponent,
    CategoryCreateComponent,
    CategoryModalComponent,
    CategoryComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    CategoryComponent,
    CategoryCreateComponent,
    CategoryListComponent,
    CategoryModalComponent,
  ]
})
export class CategoryModule { }
