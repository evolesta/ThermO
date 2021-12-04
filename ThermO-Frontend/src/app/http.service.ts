import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIURL } from './settings';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  accessToken;

  constructor(private http: HttpClient) 
    { }

  public get(endpoint: string)
  {
    return this.http.get(APIURL + endpoint, { observe: 'response' });
  }
}
