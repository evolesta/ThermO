import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { HttpService } from 'src/app/http.service';

@Component({
  selector: 'app-edit-thermostat',
  templateUrl: './edit-thermostat.page.html',
  styleUrls: ['./edit-thermostat.page.scss'],
})
export class EditThermostatPage implements OnInit {
  thermostatId: any;
  thermostatData: any;
  model: Thermostat = new Thermostat();

  constructor(private modalController: ModalController,
    private navParams: NavParams,
    private http: HttpService) { }

  ngOnInit() {
    this.thermostatId = this.navParams.get('id');
    this.getThermostatData();
  }

  getThermostatData()
  {   
    this.http.get('/sensors/' + this.thermostatId + '/').subscribe(resp => {
      const response:any = resp.body;
      this.model = new Thermostat(response.name, response.sensorAddress, response.active);
    })
  }

  dismissModal() 
  {
    this.modalController.dismiss({
      'success': false
    });
  }

  editThermostat(formdata: any)
  {
    console.log(formdata)
    this.http.put('/sensors/' + this.thermostatId + '/', formdata).subscribe(resp => {
      this.modalController.dismiss({
        'success': true
      });
    });
  }

}

// Thermostat model
class Thermostat
{
  constructor(public Name: string = '',
    public sensorAddress: string = '',
    public active: boolean = false) {}
}