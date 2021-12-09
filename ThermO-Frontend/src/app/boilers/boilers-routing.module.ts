import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BoilersPage } from './boilers.page';

const routes: Routes = [
  {
    path: '',
    component: BoilersPage
  },
  {
    path: 'add-boiler',
    loadChildren: () => import('./add-boiler/add-boiler.module').then( m => m.AddBoilerPageModule)
  },
  {
    path: 'edit-boiler',
    loadChildren: () => import('./edit-boiler/edit-boiler.module').then( m => m.EditBoilerPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoilersPageRoutingModule {}
