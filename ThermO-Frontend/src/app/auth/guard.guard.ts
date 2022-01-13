import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, from } from 'rxjs';
import { StorageService } from '../storage.service';
import { AuthService } from './login/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuardGuard implements CanActivate {

  constructor(private storage: StorageService,
    private router: Router,
    private auth: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      const jwtHelper = new JwtHelperService();

      // get accesstoken from storage
      return this.storage.get('accessToken').then(token => {

        // check if token is valid
        if (!jwtHelper.isTokenExpired(token)) {
          return true;
        }
        else {
          // token is expired - check if user has activated stay logged in
          this.storage.get('stayLoggedin').then(stayLoggedin => {
            if (stayLoggedin) {
              // refresh the tokens and continue
              this.auth.refresh();
              return true;
            } else {
              // redirect user to login page
              this.router.navigateByUrl('/login');
              return false;
            }
          })
        }
      });
  }
  
}
