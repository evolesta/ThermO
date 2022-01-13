import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIURL} from 'src/app/settings';
import { Observable, Subject } from 'rxjs';
import { StorageService } from 'src/app/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
    private storage: StorageService) { }

  // login to API with username and and receive a set of tokens
  login(formdata: any): Observable<Boolean> {
    const result = new Subject<Boolean>();

    // perform POST call to API
    this.http.post(APIURL + '/api/token/', formdata, { observe: 'response' }).subscribe(resp => {

      // save body of response in const
      const response:any = resp.body;

      // save set of tokens to storage
      this.storage.set('accessToken', response.access);
      this.storage.set('refreshToken', response.refresh);
      this.storage.set('stayLoggedin', formdata.stayLoggedin)

      result.next(true);
    },
    (error) => {
      // error in response
      console.log(error);
      result.next(false);
    });

    return result.asObservable();
  }

  refresh(): string
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

  // checks if the user already has set a pincode
  isPinConfigured(): Promise<Boolean> {

    return this.storage.get('pincode').then(pincode => {

      if (pincode == null) {
        // no pin has been set
        return false;
      }

      return true;
    });
  }

  // save new pincode to storage
  saveNewPincode(pincode: string) {
    this.storage.set('pincode', pincode);
  }

  // validate pincode
  validatePincode(pincode: string): Promise<Boolean> {

    return this.storage.get('pincode').then(dbPin => {
      if (pincode == dbPin) {
        return true;
      } else {
        return false;
      }
    });
  }

  isUserAlreadyLoggedin(): Promise<Boolean> {
    
    return this.storage.get('stayLoggedin').then(stayLoggedin => {
      
      if (stayLoggedin == null) {
        return false;
      }

      return stayLoggedin; // storage contains the boolean to return
    })
  }
}