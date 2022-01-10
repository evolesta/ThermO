import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { HttpService } from 'src/app/http.service';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-edit-schedule',
  templateUrl: './edit-schedule.page.html',
  styleUrls: ['./edit-schedule.page.scss'],
})
export class EditSchedulePage implements OnInit {

  constructor(private navParams: NavParams,
    private modalController: ModalController,
    private alertController: AlertController,
    private http: HttpService) { }

  id: number;
  model: Schedule = new Schedule();
  groupedActive: boolean;
  sensors: any;
  public weekdays: KeyValue<number, string>[] = [
    { key: 1, value: 'Maandag' },
    { key: 2, value: 'Dinsdag' },
    { key: 3, value: 'Woensdag' },
    { key: 4, value: 'Donderdag' },
    { key: 5, value: 'Vrijdag' },
    { key: 6, value: 'Zaterdag' },
    { key: 7, value: 'Zondag' },
  ];

  ngOnInit() {
    this.id = this.navParams.get('id');
    this.groupedActive = this.navParams.get('grouped');
    this.getScheduleData();
  }

  dismissModal() 
  {
    this.modalController.dismiss({
      edit: false
    });
  }

  getScheduleData()
  {
    if (this.groupedActive)
    {
      this.http.get('/schedule-grouped/' + this.id + '/').subscribe(resp => {
        const response:any = resp.body;
        this.model = new Schedule(0, response.group, response.start, response.sensor?.id, response.temperature);
      });
    }
    else
    {
      this.http.get('/schedule-single/' + this.id + '/').subscribe(resp => {
        const response:any = resp.body;
        this.model = new Schedule(response.weekday, '', response.start, response.sensor?.id, response.temperature);
      });
    }

    this.http.get('/sensors/').subscribe(resp => {
      this.sensors = resp.body;
    });
  }

  changeTempValue(event)
  {
    this.model.temperature = event.target.value;
  }

  async deleteSchedule()
  {
    const alert = await this.alertController.create({
      header: 'Weet je het zeker?',
      message: 'Weet je zeker dat je dit schema onderdeel wilt verwijderen?',
      buttons: [
        {
          text: 'Annuleren',
          role: 'cancel'
        },
        {
          text: 'Verwijderen',
          handler: () => {
            var url;
            (this.groupedActive) ? url = '/schedule-grouped/' : url = '/schedule-single/';

            this.http.delete(url + this.id + '/').subscribe(resp => {
              this.modalController.dismiss({delete: true});
            });
          }
        }
      ]
    });

    return await alert.present();
  }

  submitSchedule(formdata: any)
  {
    var url;
    (this.groupedActive) ? url = '/schedule-grouped/' : url = '/schedule-single/';
    
    this.http.put(url + this.id + '/', formdata).subscribe(resp => {
      this.modalController.dismiss({edit: true});
    });
  }

}

class Schedule
{
  constructor(public weekday:number = 0,
    public group:string = '',
    public start:string = '',
    public sensor:number = 0,
    public temperature: number = 0) {}
}