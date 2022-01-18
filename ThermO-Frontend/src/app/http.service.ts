import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  public post(endpoint: string, body: any)
  {
    return this.http.post(APIURL + endpoint, body, { observe: 'response' });
  }

  public put(endpoint: string, body: any)
  {
    return this.http.put(APIURL + endpoint, body, { observe: 'response'});
  }

  public delete(endpoint: string)
  {
    return this.http.delete(APIURL + endpoint, { observe: 'response'});
  }
}
