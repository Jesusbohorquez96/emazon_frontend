import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryCreateComponent } from './category-create/category-create.component';
import { CategoryModalComponent } from './category-modal/category-modal.component';
import { CategoryComponent } from '@/app/modules/category/category.component';
import { AtomsModule } from '@/app/components/atoms/atoms.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CategoryListComponent,
    CategoryCreateComponent,
    CategoryModalComponent,
    CategoryComponent,
  ],
  imports: [
    CommonModule,
    AtomsModule,
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
