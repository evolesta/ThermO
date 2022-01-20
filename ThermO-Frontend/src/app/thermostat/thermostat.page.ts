import { Component, OnInit } from '@angular/core';
import { MenuController, ToastController } from '@ionic/angular';
import { interval, Subscription } from 'rxjs';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-thermostat',
  templateUrl: './thermostat.page.html',
  styleUrls: ['./thermostat.page.scss'],
})
export class ThermostatPage implements OnInit {
  desiredTemperature: number;
  currentTemperature: number;
  heating: boolean;
  settingsmodel: Settings = new Settings();
  model: Thermostat = new Thermostat();
  private updateSubscription: Subscription;

  constructor(private menu: MenuController,
    private http: HttpService,
    private toastController: ToastController) { }

  ngOnInit() {
    this.menu.enable(true); // enable menu for redirects from login
    this.getTemperatures();
    this.getSettings();

    this.updateSubscription = interval(60000).subscribe((val) => {
      this.getTemperatures();
    });
  }

  // gets the current temperatures from the back-end
  getTemperatures() 
  {
    this.http.get('/heatpoint/').subscribe(resp => {
      const response:any = resp.body;
      this.currentTemperature = response.temperature;
      this.desiredTemperature = response.heatpoint;
      this.heating = response.heating;
      this.model = new Thermostat(response.heatpoint);
    });
  }

  getSettings() {
    this.http.get('/settings/').subscribe(resp => {
      const response:any = resp.body;
      this.settingsmodel = new Settings(response.activeBoiler,
        response.defaultBoilerTemp,
        response.defaultSensor,
        response.scheduleGrouped,
        response.scheduleEnabled,
        response.heatpointThreshold)
    });
  }

  invertScheduleEnabled(enabled: boolean) {
    this.settingsmodel.scheduleEnabled = enabled;

    this.http.put('/settings/1/', this.settingsmodel).subscribe(resp=> {
      var message;

      if (enabled) {
        message = 'Schema succesvol geactiveerd'
      }
      else {
        message = 'Schema succesvol gedeactiveerd'
      }

      this.toastController.create({
        message: message,
        color: 'success',
        duration: 4000
      }).then(toast => {
        toast.present();
      });
    });
  }

  // method is called when the range slider has changed
  setTemperature(event)
  {
    // get new value from slider
    this.desiredTemperature = event.target.value;
  }

  updateTemperature(formdata: any)
  {
    const body = {
      'heatpoint': formdata.desiredTemperature,
      'temperature': this.currentTemperature
    };

    this.http.put('/heatpoint/1/', body).subscribe(response => {
      this.toastController.create({
        message: 'Opdracht verzonden naar server',
        color: 'success',
        duration: 4000,
      }).then(toast => {
        toast.present();
      });
    });
  }
}

class Thermostat
{
  constructor(public desiredTemperature:number = 0) {}
}

class Settings
{
  constructor(public activeBoiler: number = 0,
    public defaultBoilerTemp: number = 0,
    public defaultSensor: number = 0,
    public scheduleGrouped: boolean = true,
    public scheduleEnabled: boolean = true,
    public heatpointThreshold: number = 0) {}
}