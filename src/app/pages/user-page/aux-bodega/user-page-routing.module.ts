import { AuxBodegaComponent } from '@/app/modules/user/aux-bodega/aux-bodega.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AuxBodegaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserPageRoutingModule { }
