import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-thermostat',
  templateUrl: './thermostat.page.html',
  styleUrls: ['./thermostat.page.scss'],
})
export class ThermostatPage implements OnInit {
  desiredTemperature;
  currentTemperature;

  constructor(private menu: MenuController,
    private http: HttpService) { }

  ngOnInit() {
    this.menu.enable(true); // enable menu for redirects from login
    this.getTemperatures();

    $("#slider1").roundSlider({
      value: 45
    });
  }

  // gets the current temperatures from the back-end
  getTemperatures() 
  {
    this.http.get('/heatpoint/').subscribe(resp => {
      const response:any = resp.body;
      this.currentTemperature = response.temperature;
      this.desiredTemperature = response.heatpoint;
    });
  }

  // method is called when the range slider has changed
  setTemperature(event)
  {
    // get new value from slider
    this.desiredTemperature = event.target.value;
  }

  updateTemperature(event)
  {
    console.log('Zet volgende naar api' + event.target.value);

    const body = {
      'heatpoint': this.desiredTemperature,
      'temperature': this.currentTemperature
    };

    this.http.put('/heatpoint/1/', body).subscribe(response => {
      console.log(response);
    });
  }
}
