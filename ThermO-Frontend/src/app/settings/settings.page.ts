import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  model: Setting = new Setting();
  boilersData: any;

  constructor(private http: HttpService,
    private toastController: ToastController) { }

  ngOnInit() {
    this.getSettings();
    this.getBoilers();
  }

  getSettings()
  {
    this.http.get('/settings/').subscribe(resp => {
      const response:any = resp.body;
      this.model = new Setting(response.activeBoiler, response.defaultBoilerTemp, response.scheduleGrouped);
    })
  }

  getBoilers()
  {
    this.http.get('/boilers/').subscribe(resp => {
      this.boilersData = resp.body;
    });
  }

  saveSettings(formdata: any)
  {
    this.http.put('/settings/1/', formdata).subscribe(resp => {
      console.log(resp)
      this.toastController.create({
        message: 'Instellingen succesvol opgeslagen.',
        color: 'success',
        duration: 4000
      }).then(toastRes => {
        toastRes.present();
      });
    });
  }

}

class Setting
{
  constructor(public activeBoiler: number = 0,
    public defaultBoilerTemp: number = 0,
    public scheduleGrouped: boolean = true) {}
}