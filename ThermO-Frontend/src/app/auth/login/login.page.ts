import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  model: Login = new Login();
  error: string;

  constructor(private menu: MenuController,
    private auth: AuthService,
    private router: Router,
    private alertController: AlertController) { }

  ngOnInit() {
    this.menu.enable(false);
  }

  // perform login action at back-end
  performLogin(formdata: any) {
    this.auth.login(formdata).subscribe(success => {
      // check for succesfull login
      if (success) {
        this.router.navigateByUrl('/thermostat');
      }
      else {
        this.alertController.create({
          header: 'Inloggen mislukt',
          message: 'Onjuiste gebruikersnaam en/of wachtwoord.',
          buttons: ['OK']
        }).then(alertRes => {
          alertRes.present();
        });
      }
    });
  }

}

class Login
{
  constructor(public username: string = '',
    public password: string = '',
    public stayLoggedin: boolean = false) { }
}