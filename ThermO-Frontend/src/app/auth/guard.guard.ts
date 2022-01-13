import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class GuardGuard implements CanActivate {

  constructor(private storage: StorageService,
    private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      const jwtHelper = new JwtHelperService();

      // check if accessToken exists and is still valid
      return this.storage.get('accessToken').then(token => {
        if (jwtHelper.isTokenExpired(token)) {
          
          this.router.navigateByUrl('/login');
          return false;
        }
        else {
          return true;
        }
      });
  }
  
}
