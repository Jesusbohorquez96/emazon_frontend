import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/components/auth/guard/auth.guard';
import { APP_CONSTANTS } from 'src/styles/constants';

const routes: Routes = [
  {
    path: APP_CONSTANTS.CATEGORIES,
    loadChildren: () => import('./pages/category-page/category-page.module').then(m => m.CategoryPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: APP_CONSTANTS.BRANDS,
    loadChildren: () => import('./pages/brand-page/brand-page.module').then(m => m.BrandPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: APP_CONSTANTS.ARTICLES,
    loadChildren: () => import('./pages/article-page/article-page.module').then(m => m.ArticlePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: APP_CONSTANTS.AUXBODEGA,
    loadChildren: () => import('./pages/user-page/aux-bodega/user-page.module').then(m => m.UserPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: APP_CONSTANTS.HOME,
    loadChildren: () => import('./pages/home-page/home-page.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: APP_CONSTANTS.CUSTOMER,
    loadChildren: () => import('./pages/user-page/customer-page/customer-page.module').then(m => m.CustomerPageModule)
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
