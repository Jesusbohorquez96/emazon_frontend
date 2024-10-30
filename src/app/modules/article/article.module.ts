import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleCreateComponent } from './article-create/article-create.component';
import { ArticleComponent } from '@/app/modules/article/article.component';
import { AtomsModule } from '@/app/components/atoms/atoms.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryModule } from '../category/category.module';
import { BrandModule } from '../brand/brand.module';
import { StockModule } from "../stock/stock.module";


@NgModule({
    declarations: [
        ArticleListComponent,
        ArticleCreateComponent,
        ArticleComponent
    ],
    imports: [
        CommonModule,
        AtomsModule,
        FormsModule,
        ReactiveFormsModule,
        CategoryModule,
        BrandModule,
        StockModule
    ],
    exports: [
        ArticleListComponent,
        ArticleCreateComponent,
        ArticleComponent
    ]
})
export class ArticleModule { }
