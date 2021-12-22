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

  model: Boiler = new Boiler();

  constructor(private modalController: ModalController,
    private http: HttpService) { }

  ngOnInit() {
  }

  // close modal
  dismissModal()
  {
    // close modal
    this.modalController.dismiss({
      success: false
    });
  }

  // submit new boiler to API
  addBoiler(formdata: any)
  {
    // POST request
    this.http.post('/boilers/', formdata).subscribe(resp => {
      this.modalController.dismiss({
        success: true
      });
    });
  }

}

class Boiler
{
  constructor(public name: string = '',
    public boilerAddress: string = '') {}
}