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
  model: Boiler = new Boiler();

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
      const response:any = data.body;
      this.model = new Boiler(response.name, response.boilerAddress);
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
      this.modalController.dismiss({
        edit: true
      });
    });
  }

  async deleteBoiler()
  {
    const alert = await this.alertController.create({
      header: 'Weet je het zeker?',
      message: 'Weet je zeker dat je deze ketel wilt verwijderen?',
      buttons: [
        {
          text: 'Annuleren',
          role: 'cancel'
        },
        {
          text: 'Verwijderen',
          handler: () => {
            this.http.delete('/boilers/' + this.boilerId + '/').subscribe(resp => {
              this.modalController.dismiss({
                remove: true
              });
            });
          }
        }
      ]
    });

    return await alert.present();
  }

}

class Boiler
{
  constructor(public name: string = '',
    public boilerAddress: string = '') {}
}