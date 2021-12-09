import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddThermostatPageRoutingModule } from './add-thermostat-routing.module';

import { AddThermostatPage } from './add-thermostat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddThermostatPageRoutingModule
  ],
  declarations: [AddThermostatPage]
})
export class AddThermostatPageModule {}
