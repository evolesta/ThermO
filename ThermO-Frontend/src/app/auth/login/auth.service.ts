import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIURL, REFRESHTOKEN_LIFETIME, ACCESSTOKEN_LIFETIME } from 'src/app/settings';
import { Subject } from 'rxjs';
import { StorageService } from 'src/app/storage.service';

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
      this.storage.set('tokensReceived', new Date());

      loginSuccess.next(true);
    },
    (error) => {
      // error in response
      console.log(error);
      loginSuccess.next(false);
    });

    return loginSuccess;
  }

  // obtain a new set of tokens with a refresh
  refreshToken(refreshToken): Subject<Boolean>
  {
    var refreshSuccess = new Subject<Boolean>();
    var body = { "refresh": refreshToken };

    this.http.post(APIURL + '/api/token/refresh/', body, { observe: 'response' }).subscribe(resp => {
        const response:any = resp.body;

      // save the new set of tokens to storage
      this.storage.set('accessToken', response.access);
      this.storage.set('refreshToken', response.refresh);
      this.storage.set('tokensReceived', new Date());

      refreshSuccess.next(true);
    }, error => {
      console.log(error);
      refreshSuccess.next(false);
    });

    return refreshSuccess;
  }

  // checks if tokens are still valid and if necessary refreshing it
  isStillValid(): Subject<Boolean>
  {
    var isValid = new Subject<Boolean>();
    var currentDT = new Date(); // retrieve current datetime
    var tokensReceivedDT;

    // retrieve datetime from storage
    this.storage.get('tokensReceived').then(data => {
      tokensReceivedDT = data;

        // calc difference between the current and token received datetimes
      var difference = currentDT.getTime() - tokensReceivedDT.getTime();
      difference /= 1000;
      difference /= 60; // difference in minutes
      
      if (difference < ACCESSTOKEN_LIFETIME)
      {
        // access token is still valid, no action required
        isValid.next(true);
      }
      else if (difference < REFRESHTOKEN_LIFETIME)
      {
        // refresh token is valid, refresh login
        this.storage.get('refreshToken').then(refreshToken => 
          { 
            this.refreshToken(refreshToken).subscribe(success => { isValid.next(true); }, error => { isValid.next(false); })
          });
      }
      else
      {
        // tokens not valid anymore, login required
        isValid.next(false);
      }
    });

    return isValid;
  }

  async getAccessToken()
  {
    var accessToken;
    this.storage.get('accessToken').then(data => { accessToken = data; });
    return accessToken;
  }
}