import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditThermostatPageRoutingModule } from './edit-thermostat-routing.module';

import { EditThermostatPage } from './edit-thermostat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditThermostatPageRoutingModule
  ],
  declarations: [EditThermostatPage]
})
export class EditThermostatPageModule {}
