import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { HttpService } from 'src/app/http.service';

@Component({
  selector: 'app-add-schedule',
  templateUrl: './add-schedule.page.html',
  styleUrls: ['./add-schedule.page.scss'],
})
export class AddSchedulePage implements OnInit {

  constructor(private modalController: ModalController,
    private http: HttpService,
    private navParams: NavParams) { }

  public weekdays: KeyValue<number, string>[] = [
    { key: 1, value: 'Maandag' },
    { key: 2, value: 'Dinsdag' },
    { key: 3, value: 'Woensdag' },
    { key: 4, value: 'Donderdag' },
    { key: 5, value: 'Vrijdag' },
    { key: 6, value: 'Zaterdag' },
    { key: 7, value: 'Zondag' },
  ];

  desiredTemperature: number = 20.0;
  groupedActive: boolean;
  model: Schedule = new Schedule();

  ngOnInit() {
    this.groupedActive = this.navParams.get('grouped');
  }

  dismissModal() {
    this.modalController.dismiss({
      success: false
    });
  }

  changeTempValue(event)
  {
    this.desiredTemperature = event.target.value;
  }

  submitNewSchedule(formdata: any)
  {
    var url: string;
    (this.groupedActive) ? url = '/schedule-grouped/' : url = '/schedule-single/';

    this.http.post(url, formdata).subscribe(resp => {
      this.modalController.dismiss({add: true});
    });
  }

}

class Schedule
{
  constructor(public weekday: number = 0,
    public group:string = '',
    public start: string = '',
    public end: string = '',
    public temperature: number = 20.0) {}
}