import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { HttpService } from '../http.service';
import { AddThermostatPage } from './add-thermostat/add-thermostat.page';
import { EditThermostatPage } from './edit-thermostat/edit-thermostat.page';

@Component({
  selector: 'app-thermostats',
  templateUrl: './thermostats.page.html',
  styleUrls: ['./thermostats.page.scss'],
})
export class ThermostatsPage implements OnInit {
  thermostats: any;

  constructor(private http: HttpService,
    private modalController: ModalController,
    private toastController: ToastController,
    private alertController: AlertController) { }

  ngOnInit() {
    this.getThermostats();
  }

  getThermostats()
  {
    this.http.get('/sensors/').subscribe(resp => {
      this.thermostats = resp.body;
    })
  }
  
  async openAddThermostatModal()
  {
    const modal = await this.modalController.create({component: AddThermostatPage});

    modal.onDidDismiss().then(data => {
      if (data.data.success)
      {
        this.toastController.create({
          message: 'Sensor succesvol aangemaakt.',
          duration: 4000,
          color: 'success'
        }).then(toastRes => {
          toastRes.present();
        });

        this.getThermostats();
      }
    });

    return await modal.present();
  }

  async openEditThermostatModal(id)
  {
    const modal = await this.modalController.create({
      component: EditThermostatPage,
      componentProps: { id: id }
    });

    modal.onDidDismiss().then(data => {
      if (data.data.success)
      {
        this.toastController.create({
          message: 'Sensor succesvol gewijzigd.',
          duration: 4000,
          color: 'success'
        }).then(toastRes => {
          toastRes.present();
        });

        this.getThermostats();
      }
    });

    return await modal.present();
  }

  async deleteThermostat(id)
  {
    const alert = await this.alertController.create({
      header: 'Weet je het zeker?',
      message: 'Weet je zeker dat je deze thermostaat wilt verwijderen?',
      buttons: [
        {
          text: 'Annuleren',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Verwijderen',
          cssClass: 'primary',
          handler: () => {
            this.http.delete('/sensors/' + id + '/').subscribe(resp => {
              this.getThermostats();

              this.toastController.create({
                message: 'Thermostaat succesvol verwijderd.',
                duration: 4000,
                color: 'success'
              }).then(toastRes => {
                toastRes.present();
              });
            });
          }
        }
      ]
    });

    await alert.present();
  }

}
