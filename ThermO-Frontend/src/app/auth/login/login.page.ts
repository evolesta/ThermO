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

  constructor(private menu: MenuController,
    private auth: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.menu.enable(false);

    // if user has a valid token, redirect to secured area
    (this.auth.isStillValid()) && this.router.navigate(['/thermostat']);
  }

  // perform login action at back-end
  performLogin(formdata: any) {
    console.log(formdata);

    this.auth.login(formdata).subscribe(success => {
      // check for succesfull login
      if(success)
      {
        this.router.navigate(['/thermostat']);
      }
    });
  }

}