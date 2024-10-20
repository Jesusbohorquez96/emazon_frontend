import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticleCreateComponent } from './article-create/article-create.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleComponent } from 'src/app/components/pages/article/article.component';
import { SharedModule } from '../../atoms/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrandsModule } from "../brands/brands.module";
import { CategoryModule } from "../category/category.module";

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
        BrandsModule,
        CategoryModule
    ],
    exports: [
        ArticleListComponent,
        ArticleCreateComponent,
        ArticleComponent
    ]
})
export class ArticlesModule { }
