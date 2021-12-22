import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  model: Login = new Login();

  constructor(private menu: MenuController,
    private auth: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.menu.enable(false);
  }

  // perform login action at back-end
  performLogin(formdata: any) {
    this.auth.login(formdata).subscribe(success => {
      // check for succesfull login
      success && this.router.navigateByUrl('/thermostat');
    });
  }

}

class Login
{
  constructor(public username: string = '',
    public password: string = '',
    public stayLoggedin: boolean = false) { }
}