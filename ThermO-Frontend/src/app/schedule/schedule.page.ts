import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { HttpService } from '../http.service';
import { AddSchedulePage } from './add-schedule/add-schedule.page';
import { EditSchedulePage } from './edit-schedule/edit-schedule.page';

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
  public sensorsData: any;
  public start: any;
  public end: any;
  public model: GroupedDaysView = new GroupedDaysView();

  constructor(private http: HttpService,
    private datepipe: DatePipe,
    private modalController: ModalController,
    private toastController: ToastController) { }

  ngOnInit() {
    this.getSchedule();
  }

  getSchedule()
  {
    // first get view from settings, grouped or single day view
    this.http.get('/settings/').subscribe(resp => {
      const response:any = resp.body;
      this.model.active = response.scheduleGrouped;

      // define which back-end model to retrieve
      var url: string;
      (this.model.active) ? url = '/schedule-grouped/' : url = '/schedule-single/';

        this.http.get(url).subscribe(resp => {
          this.scheduleData = resp.body;
          console.log(this.scheduleData)
        });
    });
  }

  async openAddScheduleModal(group: string)
  {
    const modal = await this.modalController.create({
      component: AddSchedulePage,
      componentProps: {
        grouped: this.model.active,
        group: group
      }
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

  async openEditScheduleModal(id: number, group: string)
  {
    const modal = await this.modalController.create({
      component: EditSchedulePage,
      componentProps: { 
        id: id,
        grouped: this.model.active,
        group: group
      }
    });

    modal.onDidDismiss().then(data => {
      if (data.data.delete)
      {
        this.getSchedule();
        this.toastController.create({
          message: 'Schema succesvol verwijderd.',
          color: 'success',
          duration: 4000
        }).then(toastRes => {
          toastRes.present();
        });
      }

      if (data.data.edit)
      {
        this.getSchedule();
        this.toastController.create({
          message: 'Schema succesvol gewijzigd.',
          color: 'success',
          duration: 4000
        }).then(toastRes => {
          toastRes.present();
        })
      }
    })

    return await modal.present();
  }

}

class GroupedDaysView
{ 
  constructor(public active: boolean = true) {}
}