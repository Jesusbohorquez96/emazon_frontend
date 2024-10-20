import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../atoms/shared.module';

import { CategoryModule } from './category/category.module';
import { BrandsModule } from './brands/brands.module';
import { ArticlesModule } from './articles/articles.module';
import { UsersModule } from './users/users.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    CategoryModule,
    BrandsModule,
    ArticlesModule,
    UsersModule,
  ]
})
export class IndexModule { }
