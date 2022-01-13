import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, MenuController } from '@ionic/angular';
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
    private toastController: ToastController) { }

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
        this.toastController.create({
          message: 'Inloggen mislukt. Onjuiste gebruikersnaam/wachtwoord.',
          color: 'danger',
          duration: 4000,
          position: 'top'
        }).then(toast => {
          toast.present();
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