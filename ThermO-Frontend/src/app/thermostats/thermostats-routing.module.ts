import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ThermostatsPage } from './thermostats.page';

const routes: Routes = [
  {
    path: '',
    component: ThermostatsPage
  },
  {
    path: 'add-thermostat',
    loadChildren: () => import('./add-thermostat/add-thermostat.module').then( m => m.AddThermostatPageModule)
  },
  {
    path: 'edit-thermostat',
    loadChildren: () => import('./edit-thermostat/edit-thermostat.module').then( m => m.EditThermostatPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThermostatsPageRoutingModule {}
