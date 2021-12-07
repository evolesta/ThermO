import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeleteBoilerPageRoutingModule } from './delete-boiler-routing.module';

import { DeleteBoilerPage } from './delete-boiler.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeleteBoilerPageRoutingModule
  ],
  declarations: [DeleteBoilerPage]
})
export class DeleteBoilerPageModule {}
