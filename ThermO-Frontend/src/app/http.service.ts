import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  APIURL: string;

  constructor(private http: HttpClient) 
    {
      this.APIURL = environment.apiUrl;
    }

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
