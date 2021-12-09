import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpService } from 'src/app/http.service';

@Component({
  selector: 'app-add-thermostat',
  templateUrl: './add-thermostat.page.html',
  styleUrls: ['./add-thermostat.page.scss'],
})
export class AddThermostatPage implements OnInit {

  constructor(private modalController: ModalController,
    private http: HttpService) { }

  ngOnInit() {
  }

  dismissModal()
  {
    this.modalController.dismiss({
      'success': false
    });
  }

  addThermostat(formdata: any)
  {
    console.log(formdata);
    this.http.post('/sensors/', formdata).subscribe(resp => {
      this.modalController.dismiss({
        'success': true
      });
    });
  }

}
