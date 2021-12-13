import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'thermostat',
    loadChildren: () => import('./thermostat/thermostat.module').then( m => m.ThermostatPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'boilers',
    loadChildren: () => import('./boilers/boilers.module').then( m => m.BoilersPageModule)
  },
  {
    path: 'thermostats',
    loadChildren: () => import('./thermostats/thermostats.module').then( m => m.ThermostatsPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'schedule',
    loadChildren: () => import('./schedule/schedule.module').then( m => m.SchedulePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
