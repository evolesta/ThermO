import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonRouterOutlet, MenuController } from '@ionic/angular';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private menu: MenuController,
    private auth: AuthService,
    private router: Router,
    private ionRouter: IonRouterOutlet) { }

  ngOnInit() {
    this.menu.enable(false);
  }

  // perform login action at back-end
  performLogin(formdata: any) {
    this.auth.login(formdata).subscribe(success => {
      // check for succesfull login
      if(success)
      {
        this.router.navigateByUrl('/thermostat');
      }
    });
  }

}
