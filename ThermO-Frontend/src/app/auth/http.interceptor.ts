// JWT interceptor
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators'
import { AuthService } from './login/auth.service';
import { StorageService } from '../storage.service';


@Injectable()
export class httpInterceptor implements HttpInterceptor {

    constructor(private auth: AuthService,
        private storage: StorageService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        return from(this.auth.isStillValid().pipe(switchMap(succes => {
            return from(this.storage.get('accessToken')).pipe(switchMap(accessToken => {
                const headers = {
                 'Authorization': 'Bearer ' + accessToken,
             };
 
             request = request.clone({
                 setHeaders: headers
             });
 
             // return new request with authorization headers
             return next.handle(request);
            }));
        })));
    }
}