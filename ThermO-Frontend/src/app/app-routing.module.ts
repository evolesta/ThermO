import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { GuardGuard } from './auth/guard.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'thermostat',
    canActivate: [GuardGuard],
    loadChildren: () => import('./thermostat/thermostat.module').then( m => m.ThermostatPageModule)
  },
  {
    path: 'boilers',
    canActivate: [GuardGuard],
    loadChildren: () => import('./boilers/boilers.module').then( m => m.BoilersPageModule)
  },
  {
    path: 'thermostats',
    canActivate: [GuardGuard],
    loadChildren: () => import('./thermostats/thermostats.module').then( m => m.ThermostatsPageModule)
  },
  {
    path: 'settings',
    canActivate: [GuardGuard],
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'schedule',
    canActivate: [GuardGuard],
    loadChildren: () => import('./schedule/schedule.module').then( m => m.SchedulePageModule)
  },
  {
    path: 'logout',
    canActivate: [GuardGuard],
    loadChildren: () => import('./auth/logout/logout.module').then( m => m.LogoutPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
