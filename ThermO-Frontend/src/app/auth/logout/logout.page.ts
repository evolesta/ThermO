import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { StorageService } from 'src/app/storage.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  constructor(private storage: StorageService,
    private router: Router,
    private toastController: ToastController) { }

  ngOnInit() {
    this.logout();
  }

  logout() {
    this.storage.remove('accessToken').then(res => {
      this.toastController.create({
        message: 'Succesvol uitgelogd.',
        duration: 4000,
        color: 'success',
        position: 'top'
      }).then(toastRes => {
        toastRes.present();
      });

      this.router.navigateByUrl('/login');
    });
  }

}
