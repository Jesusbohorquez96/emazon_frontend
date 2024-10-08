import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { CategoryComponent } from './category/category.component';
import { BrandComponent } from './brand/brand.component';
import { APP_CONSTANTS } from 'src/styles/constants';

const routes: Routes = [
  { path: APP_CONSTANTS.WELCOME, component: WelcomeComponent }, 
  { path: APP_CONSTANTS.CATEGORIES, component: CategoryComponent },
  { path: APP_CONSTANTS.BRANDS, component: BrandComponent },
  { path: APP_CONSTANTS.DEFAULT, redirectTo: `/${APP_CONSTANTS.WELCOME}`, pathMatch: 'full' },
  { path: APP_CONSTANTS.WILDCARD, redirectTo: `/${APP_CONSTANTS.WELCOME}`, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
