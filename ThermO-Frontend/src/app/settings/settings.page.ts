import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
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
    private toastController: ToastController,
    private alertController: AlertController) { }

  ngOnInit() {
    this.getSettings();
    this.getBoilers();
  }

  getSettings()
  {
    this.http.get('/settings/').subscribe(resp => {
      const response:any = resp.body;
      this.model = new Setting(
        response.activeBoiler, 
        response.defaultBoilerTemp, 
        response.scheduleGrouped,
        response.weatherData,
        response.openWeathermapApikey,
        response.heatpointThreshold);
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
    // check if the API key field is filled
    if (formdata.weatherData && formdata.openWeathermapApikey == "") {
      this.alertController.create({
        header: 'Geen API key ingevuld',
        message: 'Wanneer de weerdata geactiveerd wordt, moet er een geldige API key ingevuld worden. Vraag een gratis key aan op https://openweathermap.org.',
        buttons: ['OK']
      }).then(alert => {
        alert.present();
      });
    }
    else {
      console.log(formdata)
      this.http.put('/settings/1/', formdata).subscribe(resp => {
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

  showInfoToast(message: string) {
    this.toastController.create({
      message: message,
      position: 'middle',
      buttons: [
        {
          side: 'end',
          icon: 'close',
          role: 'cancel'
        }
      ]
    }).then(toast => {
      toast.present();
    })
  }

}

class Setting
{
  constructor(public activeBoiler: number = 0,
    public defaultBoilerTemp: number = 0,
    public scheduleGrouped: boolean = true,
    public weatherData: boolean = false,
    public openWeathermapApikey: string = '',
    public heatpointThreshold: number = 0,
    public weatherCity: string = '') {}
}