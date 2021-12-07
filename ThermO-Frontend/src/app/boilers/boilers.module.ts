import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BoilersPageRoutingModule } from './boilers-routing.module';

import { BoilersPage } from './boilers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BoilersPageRoutingModule
  ],
  declarations: [BoilersPage]
})
export class BoilersPageModule {}
