import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { HttpService } from '../http.service';
import { AddBoilerPage } from './add-boiler/add-boiler.page';
import { EditBoilerPage } from './edit-boiler/edit-boiler.page';

@Component({
  selector: 'app-boilers',
  templateUrl: './boilers.page.html',
  styleUrls: ['./boilers.page.scss'],
})
export class BoilersPage implements OnInit {
  public Boilers;
  modal;

  constructor(private http: HttpService,
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController) { }

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

    modal.onDidDismiss().then(data => {
      if (data.data.success)
      {
        this.getBoilers();

        this.toastController.create({
          message: 'CV-ketel succesvol aangemaakt.',
          color: 'success'
        }).then(toastRes => {
          toastRes.present();
        });
      }
    })

    return await modal.present();
  }

  async openEditBoilerModal(id)
  { 
    const modal = await this.modalController.create({
      component: EditBoilerPage,
      componentProps: { id: id }
    });

    modal.onDidDismiss().then(data => {
      if (data.data.success)
      {
        this.getBoilers();

        this.toastController.create({
          message: 'CV-ketel is succesvol gewijzigd.',
          color: 'success',
          duration: 4000
        }).then(toastRes => {
          toastRes.present();
        });
      }
    })

    return await modal.present();
  }

  async deleteBoiler(id)
  {
    const alert = await this.alertController.create({
      header: 'Weet je het zeker?',
      message: 'Weet je zeker dat je deze CV-ketel wilt verwijderen?',
      buttons: [
        {
          text: 'Annuleren',
          cssClass: 'secondary',
          role: 'cancel'
        },
        {
          text: 'Verwijderen',
          cssClass: 'danger',
          handler: () => {
            this.http.delete('/boilers/' + id + '/').subscribe(resp => {
              this.getBoilers();
              
              this.toastController.create({
                message: 'CV-ketel is succesvol verwijderd.',
                color: "success",
                duration: 4000
              }).then(toastRes => {
                toastRes.present();
              });
            })
          }
        }
      ]
    })

    await alert.present();
  }

}
