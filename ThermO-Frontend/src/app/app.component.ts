import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Thermostaat', url: '/thermostat', icon: 'thermometer' },
    { title: 'Schema', url: '/schedule', icon: 'clipboard' },
    { title: 'Thermostaten', url: '/thermostats', icon: 'apps' },
    { title: 'Ketels', url: '/boilers', icon: 'flame' },
    { title: 'Instellingen', url: '/settings', icon: 'settings' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor() {}
}
