import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { APIURL } from 'src/app/settings';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
    private storage: Storage) { }

  // login to API and receive a set of tokens
  login(formdata: any) {
    // perform POST call to API
    var response = this.http.post(APIURL + '/api/token/', formdata, { observe: 'response' });

    response.subscribe(resp => {
      // succesfull response
      var responseBody = resp.body;
      console.log(responseBody);
    });
  }
}