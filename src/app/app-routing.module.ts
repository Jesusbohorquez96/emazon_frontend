import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
  },
  {
    path: APP_CONSTANTS.DEFAULT,
    loadChildren: () => import('./pages/login-page/login-page.module').then(m => m.LoginPageModule)
  },
  {
    path: APP_CONSTANTS.lOGIN,
    loadChildren: () => import('./pages/login-page/login-page.module').then(m => m.LoginPageModule)
  },
  {
    path: '',
    redirectTo: APP_CONSTANTS.lOGIN,
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: APP_CONSTANTS.lOGIN,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
