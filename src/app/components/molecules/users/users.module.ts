import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AuxBodegaCreateComponent } from './aux-bodega-create/aux-bodega-create.component';
import { AuxBodegaComponent } from 'src/app/components/pages/aux-bodega/aux-bodega.component';
import { SharedModule } from '../../atoms/shared.module';

@NgModule({
  declarations: [
    AuxBodegaComponent,
    AuxBodegaCreateComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  exports: [
    AuxBodegaComponent,
    AuxBodegaCreateComponent
  ]
})
export class UsersModule { }
