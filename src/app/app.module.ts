import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { CategoryComponent } from './components/pages/category/category.component';
import { HomeComponent } from './components/pages/home/home.component';
import { BrandComponent } from './components/pages/brand/brand.component';
import { PaginationComponent } from './components/atoms/pagination/pagination.component';
import { TableComponent } from './components/molecules/table/table.component';
import { CategoryCreateComponent } from './components/molecules/category/category-create/category-create.component';
import { CategoryListComponent } from './components/molecules/category/category-list/category-list.component';
import { ButtonComponent } from './components/atoms/button/button.component';
import { FooterComponent } from './components/organisms/footer/footer.component';
import { NavbarComponent } from './components/organisms/navbar/navbar.component';
import { ErrorMessageComponent } from './components/atoms/errror-message/errror-message.component';
import { BrandCreateComponent } from './components/molecules/brands/brand-create/brand-create.component';
import { BrandListComponent } from './components/molecules/brands/brand-list/brand-list.component';
import { ArticleCreateComponent } from './components/molecules/articles/article-create/article-create.component';
import { ArticleComponent } from './components/pages/article/article.component';
import { ArticleListComponent } from './components/molecules/articles/article-list/article-list.component';
import { BrandModalComponent } from './components/molecules/brands/brand-modal/brand-modal.component';
import { CategoryModalComponent } from './components/molecules/category/category-modal/category-modal.component';
import { AuxBodegaCreateComponent } from './components/molecules/users/aux-bodega-create/aux-bodega-create.component';
import { AuxBodegaComponent } from './components/pages/aux-bodega/aux-bodega.component';

@NgModule({
  declarations: [
    AppComponent,
    CategoryComponent,
    HomeComponent,
    BrandComponent,
    PaginationComponent,
    TableComponent,
    CategoryCreateComponent,
    CategoryListComponent,
    ButtonComponent,
    FooterComponent,
    NavbarComponent,
    ErrorMessageComponent,
    BrandCreateComponent,
    BrandListComponent,
    ArticleCreateComponent,
    ArticleComponent,
    ArticleListComponent,
    BrandModalComponent,
    CategoryModalComponent,
    AuxBodegaCreateComponent,
    AuxBodegaComponent,
  ],

  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      timeOut: 3000,
      progressBar: true,
    }
    ),
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
