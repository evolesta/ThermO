import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { HttpService } from '../http.service';
import { AddSchedulePage } from './add-schedule/add-schedule.page';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {

  public weekdays = {
    1: 'Maandag',
    2: 'Dinsdag',
    3: 'Woensdag',
    4: 'Donderdag',
    5: 'Vrijdag',
    6: 'Zaterdag',
    7: 'Zondag',
  };
  public scheduleData: any;
  public start: any;
  public end: any;

  constructor(private http: HttpService,
    private datepipe: DatePipe,
    private modalController: ModalController,
    private toastController: ToastController) { }

  ngOnInit() {
    this.getSchedule();
  }

  getSchedule()
  {
    this.http.get('/schedule/').subscribe(resp => {
      this.scheduleData = resp.body;
      this.start = new Date(this.scheduleData.start);
      this.end = new Date(this.scheduleData.end);
    })
  }

  async openAddScheduleModal()
  {
    const modal = await this.modalController.create({
      component: AddSchedulePage
    });

    modal.onDidDismiss().then(data => {
      if (data.data.add)
      {
        this.getSchedule();
        this.toastController.create({
          message: 'Schema succesvol toegevoegd.',
          color: 'success',
          duration: 4000
        }).then(toastRes => {
          toastRes.present();
        });
      }
    });

    return await modal.present();
  }

}
