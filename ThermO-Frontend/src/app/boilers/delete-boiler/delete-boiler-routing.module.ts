import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeleteBoilerPage } from './delete-boiler.page';

const routes: Routes = [
  {
    path: '',
    component: DeleteBoilerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeleteBoilerPageRoutingModule {}
