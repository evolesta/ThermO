import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpService } from '../http.service';
import { AddBoilerPageModule } from './add-boiler/add-boiler.module';
import { AddBoilerPage } from './add-boiler/add-boiler.page';

@Component({
  selector: 'app-boilers',
  templateUrl: './boilers.page.html',
  styleUrls: ['./boilers.page.scss'],
})
export class BoilersPage implements OnInit {
  public Boilers;

  constructor(private http: HttpService,
    private modalController: ModalController) { }

  ngOnInit() {
    this.getBoilers();
  }

  // retrieve a list of boilers from API
  getBoilers()
  {
    this.http.get('/boilers/').subscribe(response => {
      this.Boilers = response.body;
    });
  }

  async openAddBoilerModal()
  {
    const modal = await this.modalController.create({component: AddBoilerPage});
    return await modal.present();
  }

}
