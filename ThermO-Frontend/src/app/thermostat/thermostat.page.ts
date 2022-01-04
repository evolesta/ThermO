import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-thermostat',
  templateUrl: './thermostat.page.html',
  styleUrls: ['./thermostat.page.scss'],
})
export class ThermostatPage implements OnInit {
  desiredTemperature: number;
  currentTemperature: number;
  model: Thermostat = new Thermostat();

  constructor(private menu: MenuController,
    private http: HttpService) { }

  ngOnInit() {
    //this.menu.enable(true); // enable menu for redirects from login
    this.getTemperatures();
  }

  // gets the current temperatures from the back-end
  getTemperatures() 
  {
    this.http.get('/heatpoint/').subscribe(resp => {
      const response:any = resp.body;
      this.currentTemperature = response.temperature;
      this.desiredTemperature = response.heatpoint;
      this.model = new Thermostat(response.heatpoint);
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
      console.log(response);
    });
  }
}

class Thermostat
{
  constructor(public desiredTemperature:number = 0) {}
}