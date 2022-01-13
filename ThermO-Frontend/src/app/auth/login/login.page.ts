import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, MenuController, AlertController } from '@ionic/angular';
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
    private toastController: ToastController,
    private alertController: AlertController) { }

  ngOnInit() {
    this.menu.enable(false);

    this.auth.isUserAlreadyLoggedin().then(skiplogin => {

      if (skiplogin) {
        this.validatePinWizard();
      }
    });
  }

  // perform login action at back-end
  performLogin(formdata: any) {
    this.auth.login(formdata).subscribe(success => {

      // check for succesfull login
      if (success) {

        // check if user has a pin configured
        this.auth.isPinConfigured().then(isConfigured => {

          // if he pin has been set, validate the pin
          if (isConfigured) {
            this.validatePinWizard();
          }
          else {
            // let the user configure a new pin
            this.configureNewPinWizard();
          }
        });
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

  validatePinWizard() {
    this.alertController.create({
      header: 'Pincode invoeren',
      message: 'Vul je pincode in ter verificatie.',
      inputs: [
        {
          name: 'pin',
          placeholder: 'Voer pincode in',
          type: 'number',
          min: 4,
          max: 4
        }
      ],
      buttons: [
        {
          text: 'Inloggen',
          handler: (data) => {
            this.auth.validatePincode(data.pin).then(validateSuccess => {
              if (validateSuccess) {
                this.router.navigateByUrl('/thermostat');
              }
              else {
                this.toastController.create({
                  message: 'Onjuiste pincode. Probeer opnieuw.',
                  duration: 4000,
                  color: 'danger',
                  position: 'top'
                }).then(toast => {
                  toast.present();
                  this.validatePinWizard();
                });
              }
            });
          }
        }
      ]
    }).then(validWizard => {
      validWizard.present();
    });
  }

  configureNewPinWizard() {
      this.alertController.create({
        header: 'Configureer nieuwe pincode',
        message: 'Stel een nieuwe pincode in. Deze pin dient na elke inlogsessie te worden ingevoerd.',
        inputs: [
          {
            name: 'pin1',
            placeholder: 'Voer pincode in',
            type: 'number',
            min: 4,
            max: 4
          },
          {
            name: 'pin2',
            placeholder: 'Herhaal pincode',
            type: 'number',
            min: 4,
            max: 4
          }
        ],
        buttons: [
          {
            text: 'Opslaan',
            handler: (data) => {

              // check if both pins aren't equal - or empty
              if (data.pin1 != data.pin2 || !data.pin1 || !data.pin2) {

                this.toastController.create({
                  header: 'Pincodes onjuist',
                  message: 'De twee ingevoerde pincodes komen niet overeen. Probeer opnieuw.',
                  color: 'danger',
                  position: 'top',
                  duration: 5000
                }).then(alertError => {
                  alertError.present();
                  this.configureNewPinWizard(); // repeat loop
                });
              }
              else {

                // pins are correct, save to storage
                this.auth.saveNewPincode(data.pin1);
                this.router.navigateByUrl('/thermostat');
                return; // exit out of loop
              }
            }
          }
        ]
      }).then(inputPrompt => {
        inputPrompt.present();
      });
  }

}

class Login
{
  constructor(public username: string = '',
    public password: string = '',
    public stayLoggedin: boolean = false) { }
}