import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditBoilerPageRoutingModule } from './edit-boiler-routing.module';

import { EditBoilerPage } from './edit-boiler.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditBoilerPageRoutingModule
  ],
  declarations: [EditBoilerPage]
})
export class EditBoilerPageModule {}
