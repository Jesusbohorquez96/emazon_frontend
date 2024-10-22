import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuxBodegaComponent } from '@/app/components/pages/aux-bodega/aux-bodega.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@/app/components/atoms/shared.module';
import { AuxBodegaCreateComponent } from '@/app/modules/user/aux-bodega-create/aux-bodega-create.component';

@NgModule({
  declarations: [
    AuxBodegaComponent,
    AuxBodegaCreateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  exports: [
    AuxBodegaComponent,
    AuxBodegaCreateComponent
  ]
})
export class UserModule { }
