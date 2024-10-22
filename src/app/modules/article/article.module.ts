import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleCreateComponent } from './article-create/article-create.component';
import { ArticleComponent } from '@/app/components/pages/article/article.component';
import { SharedModule } from '@/app/components/atoms/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryModule } from '../category/category.module';
import { BrandModule } from '../brand/brand.module';


@NgModule({
  declarations: [
    ArticleListComponent,
    ArticleCreateComponent,
    ArticleComponent
],
imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    CategoryModule,
    BrandModule
],
exports: [
    ArticleListComponent,
    ArticleCreateComponent,
    ArticleComponent
]
})
export class ArticleModule { }
