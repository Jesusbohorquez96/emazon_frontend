import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaginationComponent } from './pagination/pagination.component';
import { ButtonComponent } from './button/button.component';
import { ErrorMessageComponent } from './errror-message/errror-message.component';
import { TableComponent } from '../molecules/table/table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordComponent } from './password/password.component';

@NgModule({
  declarations: [
    PaginationComponent,
    ButtonComponent,
    ErrorMessageComponent,
    TableComponent,
    PasswordComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    PaginationComponent,
    ButtonComponent,
    ErrorMessageComponent,
    TableComponent,
    PasswordComponent,
  ]
})
export class AtomsModule { }
