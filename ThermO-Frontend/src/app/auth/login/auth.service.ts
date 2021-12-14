import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIURL, REFRESHTOKEN_LIFETIME, ACCESSTOKEN_LIFETIME } from 'src/app/settings';
import { Subject } from 'rxjs';
import { StorageService } from 'src/app/storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
    private storage: StorageService) { }

  // login to API with username and and receive a set of tokens
  login(formdata: any): Subject<Boolean> {
    var loginSuccess = new Subject<Boolean>();

    // perform POST call to API
    this.http.post(APIURL + '/api/token/', formdata, { observe: 'response' }).subscribe(resp => {

      // save body of response in const
      const response:any = resp.body;

      // save set of tokens to storage
      this.storage.set('accessToken', response.access);
      this.storage.set('refreshToken', response.refresh);
      this.storage.set('stayLoggedin', formdata.stayLoggedin)

      loginSuccess.next(true);
    },
    (error) => {
      // error in response
      console.log(error);
      loginSuccess.next(false);
    });

    return loginSuccess;
  }

  refresh(): any
  { 
    var accessToken;

    this.storage.get('refreshToken').then(token => {
      const body = {
        'refresh': token
      };
      
      this.http.post(APIURL + '/api/token/refresh/', body, { observe: 'response' }).subscribe(resp => {
      
        const response:any = resp.body;
  
        this.storage.set('accessToken', response.access);
        this.storage.set('refreshToken', response.refresh);
        
        accessToken = response.access;
      });
    });

    return accessToken;
  }
}