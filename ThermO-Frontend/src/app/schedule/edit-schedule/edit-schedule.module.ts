import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditSchedulePageRoutingModule } from './edit-schedule-routing.module';

import { EditSchedulePage } from './edit-schedule.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditSchedulePageRoutingModule
  ],
  declarations: [EditSchedulePage]
})
export class EditSchedulePageModule {}
