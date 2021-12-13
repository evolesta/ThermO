import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

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
    private datepipe: DatePipe) { }

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

}
