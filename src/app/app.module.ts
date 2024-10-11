import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CategoryComponent } from './components/pages/category/category.component';
import { HomeComponent } from './components/pages/home/home.component';
import { BrandComponent } from './components/pages/brand/brand.component';
import { PaginationComponent } from './components/atoms/pagination/pagination.component';
import { TableComponent } from './components/atoms/table/table.component';
import { CategoryCreateComponent } from './components/molecules/category-create/category-create.component';
import { CategoryListComponent } from './components/molecules/category-list/category-list.component';
import { ButtonComponent } from './components/atoms/button/button.component';
import { FooterComponent } from './components/organisms/footer/footer.component';
import { NavbarComponent } from './components/templates/navbar/navbar.component';
import { ErrorMessageComponent } from './components/atoms/errror-message/errror-message.component';
import { BrandCreateComponent } from './components/molecules/brand-create/brand-create.component';
import { BrandListComponent } from './components/molecules/brand-list/brand-list.component';

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
  ],

  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
