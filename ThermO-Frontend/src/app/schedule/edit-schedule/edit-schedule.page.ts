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
    this.http.get('/schedule/' + this.id).subscribe(data => {
      const response:any = data.body;
      this.model.weekday = response.weekday;
      this.model.start = response.start;
      this.model.end = response.end;
      this.model.temperature = response.temperature;
    });
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
            this.http.delete('/schedule/' + this.id + '/').subscribe(resp => {
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

  }

}

class Schedule
{
  constructor(public weekday:number = 0,
    public start:string = '',
    public end:string = '',
    public temperature: number = 0) {}
}