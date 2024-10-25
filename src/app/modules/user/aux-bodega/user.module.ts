import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuxBodegaComponent } from '@/app/modules/user/aux-bodega/aux-bodega.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AtomsModule } from '@/app/components/atoms/atoms.module';
import { AuxBodegaCreateComponent } from '@/app/modules/user/aux-bodega/aux-bodega-create/aux-bodega-create.component';


@NgModule({
  declarations: [
    AuxBodegaComponent,
    AuxBodegaCreateComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AtomsModule,
    ReactiveFormsModule,
  ],
  exports: [
    AuxBodegaComponent,
    AuxBodegaCreateComponent
  ]
})
export class UserModule { }
