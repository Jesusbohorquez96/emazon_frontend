import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserPageRoutingModule } from './user-page-routing.module';
import { UserModule } from '@/app/modules/user/aux-bodega/user.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UserPageRoutingModule,
    UserModule
  ]
})
export class UserPageModule { }
