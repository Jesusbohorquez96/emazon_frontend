import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticlePageRoutingModule } from './article-page-routing.module';
import { ArticleModule } from '@/app/modules/article/article.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ArticlePageRoutingModule,
    ArticleModule
  ]
})
export class ArticlePageModule { }
