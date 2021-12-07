import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { alertController } from '@ionic/core';
import { HttpService } from 'src/app/http.service';

@Component({
  selector: 'app-add-boiler',
  templateUrl: './add-boiler.page.html',
  styleUrls: ['./add-boiler.page.scss'],
})
export class AddBoilerPage implements OnInit {

  constructor(private modalController: ModalController,
    private http: HttpService,
    private alertController: AlertController) { }

  ngOnInit() {
  }

  // close modal
  dismissModal()
  {
    // close modal
    this.modalController.dismiss();
  }

  // submit new boiler to API
  addBoiler(formdata: any)
  {
    // POST request
    this.http.post('/boilers/', formdata).subscribe(resp => {
      // extract body from response
      const body = resp.body;
      this.displaySucces();
    });
  }

  async displaySucces()
  {
    const alert = await alertController.create({
      header: 'Ketel toegevoegd',
      message: 'De nieuwe CV ketel is succesvol toegevoegd.',
      buttons: ['OK']
    });

    await alert.present(); // show alert
  }

}
