import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ThermostatsPageRoutingModule } from './thermostats-routing.module';

import { ThermostatsPage } from './thermostats.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ThermostatsPageRoutingModule
  ],
  declarations: [ThermostatsPage]
})
export class ThermostatsPageModule {}
