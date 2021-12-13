import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  model: Setting = new Setting();
  boilersData: any;

  constructor(private http: HttpService) { }

  ngOnInit() {
    this.getSettings();
    this.getBoilers();
  }

  getSettings()
  {
    this.http.get('/settings/').subscribe(resp => {
      const response:any = resp.body;
      this.model = new Setting(response.activeBoiler, response.defaultBoilerTemp);
      console.log(this.model)
    })
  }

  getBoilers()
  {
    this.http.get('/boilers/').subscribe(resp => {
      this.boilersData = resp.body;
    });
  }

}

class Setting
{
  constructor(public activeBoiler: number = 0,
    public defaultBoilerTemp: number = 0) {}
}