import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddBoilerPageRoutingModule } from './add-boiler-routing.module';

import { AddBoilerPage } from './add-boiler.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddBoilerPageRoutingModule
  ],
  declarations: [AddBoilerPage]
})
export class AddBoilerPageModule {}
