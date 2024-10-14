import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { CategoryComponent } from './components/pages/category/category.component';
import { BrandComponent } from './components/pages/brand/brand.component';
import { ArticleComponent } from './components/pages/article/article.component';
import { APP_CONSTANTS } from 'src/styles/constants';

const routes: Routes = [
  { path: APP_CONSTANTS.HOME, component: HomeComponent },
  { path: APP_CONSTANTS.CATEGORIES, component: CategoryComponent },
  { path: APP_CONSTANTS.BRANDS, component: BrandComponent },
  { path: APP_CONSTANTS.ARTICLES, component: ArticleComponent },
  { path: APP_CONSTANTS.DEFAULT, redirectTo: `/${APP_CONSTANTS.HOME}`, pathMatch: 'full' },
  { path: APP_CONSTANTS.WILDCARD, redirectTo: `/${APP_CONSTANTS.HOME}`, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
