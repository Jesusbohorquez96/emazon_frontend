import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginPageRoutingModule } from './login-page-routing.module';
import { LoginModule } from '@/app/components/auth/login.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    LoginPageRoutingModule,
    LoginModule
]
})
export class LoginPageModule { }
