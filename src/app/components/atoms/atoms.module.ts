import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaginationComponent } from './pagination/pagination.component';
import { ButtonComponent } from './button/button.component';
import { ErrorMessageComponent } from './errror-message/errror-message.component';
import { TableComponent } from '../molecules/table/table.component';

@NgModule({
  declarations: [
    PaginationComponent,
    ButtonComponent,
    ErrorMessageComponent,
    TableComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    PaginationComponent,
    ButtonComponent,
    ErrorMessageComponent,
    TableComponent,
  ]
})
export class AtomsModule { }
