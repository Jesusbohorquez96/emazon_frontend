import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { HomeComponent } from './components/pages/home/home.component';

import { APP_CONSTANTS } from 'src/styles/constants';

const routes: Routes = [
  {
    path: APP_CONSTANTS.CATEGORIES,
    loadChildren: () => import('./pages/category-page/category-page.module').then(m => m.CategoryPageModule)
  },
  {
    path: APP_CONSTANTS.BRANDS,
    loadChildren: () => import('./pages/brand-page/brand-page.module').then(m => m.BrandPageModule)
  },
  {
    path: APP_CONSTANTS.ARTICLES,
    loadChildren: () => import('./pages/article-page/article-page.module').then(m => m.ArticlePageModule)
  },
  {
    path: APP_CONSTANTS.AUXBODEGA,
    loadChildren: () => import('./pages/user-page/user-page.module').then(m => m.UserPageModule)
  },
  {
    path: APP_CONSTANTS.HOME,
    loadChildren: () => import('./pages/home-page/home-page.module').then(m => m.HomePageModule)
  }
  // { path: APP_CONSTANTS.DEFAULT, redirectTo: `/${APP_CONSTANTS.HOME}`, pathMatch: 'full' },
  // { path: APP_CONSTANTS.WILDCARD, redirectTo: `/${APP_CONSTANTS.HOME}`, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
