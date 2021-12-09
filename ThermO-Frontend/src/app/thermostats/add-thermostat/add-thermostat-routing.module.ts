import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddThermostatPage } from './add-thermostat.page';

const routes: Routes = [
  {
    path: '',
    component: AddThermostatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddThermostatPageRoutingModule {}
