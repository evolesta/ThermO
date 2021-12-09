import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditThermostatPage } from './edit-thermostat.page';

const routes: Routes = [
  {
    path: '',
    component: EditThermostatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditThermostatPageRoutingModule {}
