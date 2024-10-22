import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryPageRoutingModule } from './category-page-routing.module';
import { CategoryModule } from '@/app/modules/category/category.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CategoryPageRoutingModule,
    CategoryModule,
  ]
})
export class CategoryPageModule { }
