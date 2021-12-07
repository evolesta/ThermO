import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage-angular';
import { httpInterceptor } from './auth/http.interceptor'
import { AddBoilerPageModule } from './boilers/add-boiler/add-boiler.module';
import { EditBoilerPageModule } from './boilers/edit-boiler/edit-boiler.module';
import { DeleteBoilerPageModule } from './boilers/delete-boiler/delete-boiler.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    AddBoilerPageModule,
    EditBoilerPageModule,
    DeleteBoilerPageModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  { provide: HTTP_INTERCEPTORS, useClass: httpInterceptor, multi: true}],
  bootstrap: [AppComponent],
})
export class AppModule {}
