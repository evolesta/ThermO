import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { StorageService } from 'src/app/storage.service';
import { HttpService } from '../../http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpService,
    private storage: StorageService) { }

  // login to API with username and and receive a set of tokens
  login(formdata: any): Observable<Boolean> {
    const result = new Subject<Boolean>();

    // perform POST call to API
    this.http.post('/api/token/', formdata).subscribe(resp => {

      // save body of response in const
      const response:any = resp.body;

      // save set of tokens to storage
      this.storage.set('accessToken', response.access);
      this.storage.set('refreshToken', response.refresh);
      this.storage.set('username', formdata.username);
      this.storage.set('stayLoggedin', formdata.stayLoggedin);

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
      
      this.http.post('/api/token/refresh/', body).subscribe(resp => {
      
        const response:any = resp.body;
  
        this.storage.set('accessToken', response.access);
        this.storage.set('refreshToken', response.refresh);
        
        accessToken = response.access;
      });
    });

    return accessToken;
  }

  // checks if the user already has set a pincode
  isPinConfigured(user: string): Observable<Boolean> {
    const result = new Subject<Boolean>();

    this.http.get('/userpincode/?username=' + user).subscribe(resp => {
      const response:any = resp.body;

      if (response.length == 0) {
        result.next(false);
      } else if (response[0].username == user) {
        result.next(true);
      }
      else {
        result.next(false);
      }
    });

    return result.asObservable();
  }

  // save new pincode to storage
  saveNewPincode(pincode: string, user: string) {
    const body = {
      'username': user,
      'pincode': pincode
    }

    this.http.post('/userpincode/', body).subscribe(resp => {
      console.log('success')
    });
  }

  // validate pincode
  validatePincode(pincode: string, user: string): Observable<Boolean> {
    const result = new Subject<Boolean>();

    this.http.get('/userpincode/?username=' + user).subscribe(resp => {
      const response:any = resp.body;

      if (pincode == response[0].pincode) {
        return result.next(true);
      }
      else {
        return result.next(false);
      }
    });

    return result.asObservable();
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