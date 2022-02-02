import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import apiurl from '../assets/config.json';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  accessToken;
  public APIURL = apiurl.apiurl;

  constructor(private http: HttpClient) 
    { }

  public get(endpoint: string)
  {
    return this.http.get(this.APIURL + endpoint, { observe: 'response' });
  }

  public post(endpoint: string, body: any)
  {
    return this.http.post(this.APIURL + endpoint, body, { observe: 'response' });
  }

  public put(endpoint: string, body: any)
  {
    return this.http.put(this.APIURL + endpoint, body, { observe: 'response'});
  }

  public delete(endpoint: string)
  {
    return this.http.delete(this.APIURL + endpoint, { observe: 'response'});
  }
}
