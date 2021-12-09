import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { alertController } from '@ionic/core';
import { HttpService } from 'src/app/http.service';

@Component({
  selector: 'app-edit-boiler',
  templateUrl: './edit-boiler.page.html',
  styleUrls: ['./edit-boiler.page.scss'],
})
export class EditBoilerPage implements OnInit {

  boilerId: any;
  boilerData: any;

  constructor(private modalController: ModalController,
    private http: HttpService,
    private alertController: AlertController,
    private navParams: NavParams) { }

  ngOnInit() {
    // get id
    this.boilerId = this.navParams.get('id');
    this.getBoiler();
  }

  getBoiler()
  {
    this.http.get('/boilers/' + this.boilerId + '/').subscribe(data => {
      this.boilerData = data.body;
    })
  }

  dismissModal()
  {
    this.modalController.dismiss({
      'success': false
    });
  }

  editBoiler(formdata: any)
  {
    this.http.put('/boilers/' + this.boilerId + '/', formdata).subscribe(resp => {
      this.displaySuccess();
    })
  }

  async displaySuccess()
  {
    const alert = await this.alertController.create({
      header: 'Ketel bijgewerkt', 
      message: 'De CV-ketel is bijgewerkt.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.modalController.dismiss({
              'success': true
            })
          }
        }
      ]
    });

    await alert.present(); // show alert
  }

}
