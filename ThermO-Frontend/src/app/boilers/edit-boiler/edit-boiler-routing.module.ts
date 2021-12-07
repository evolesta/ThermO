import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditBoilerPage } from './edit-boiler.page';

const routes: Routes = [
  {
    path: '',
    component: EditBoilerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditBoilerPageRoutingModule {}
