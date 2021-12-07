// JWT interceptor
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators'
import { AuthService } from './login/auth.service';
import { StorageService } from '../storage.service';
import { APIURL } from '../settings';
import { Router } from '@angular/router';


@Injectable()
export class httpInterceptor implements HttpInterceptor {

    constructor(private auth: AuthService,
        private storage: StorageService,
        private router: Router) 
        { }

        private handleAuthError(error: HttpErrorResponse): Observable<any>
        {
            if (error.status == 401)
            {   
                this.router.navigate['/login'];
            }
            return throwError(error);
        }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth token from storage
        return from(this.storage.get('accessToken')).pipe(switchMap(token => {
            request = request.clone({
                headers: request.headers.set(
                    'Authorization', 'Bearer ' + token,
                )});

            // return manipulated response
            return next.handle(request).pipe(catchError(err => this.handleAuthError(err)));
        }));
    }
}