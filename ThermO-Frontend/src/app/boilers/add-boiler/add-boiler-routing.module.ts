import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddBoilerPage } from './add-boiler.page';

const routes: Routes = [
  {
    path: '',
    component: AddBoilerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddBoilerPageRoutingModule {}
