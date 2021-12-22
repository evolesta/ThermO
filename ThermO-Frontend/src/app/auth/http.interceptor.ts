// JWT interceptor
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { EMPTY, from, Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators'
import { AuthService } from './login/auth.service';
import { StorageService } from '../storage.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { APIURL } from '../settings';


@Injectable()
export class httpInterceptor implements HttpInterceptor {

    // routes which doesn't require a auth header, for ex. auth routes
    private disallowedRoutes = [
        APIURL + '/api/token/',
        APIURL + '/api/token/refresh/'
    ];

    constructor(private storage: StorageService,
        private auth: AuthService,
        private router: Router) 
        { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth token from storage
        return from(this.storage.get('accessToken')).pipe(switchMap(token => {

            // using the JWT helper as object
            const jwtHelper = new JwtHelperService();

            // check if we are not intercepting a disallowed route
            if (!this.disallowedRoutes.includes(request.url))
            {
                // intercepting a secured route - check if token is still valid
                if (!jwtHelper.isTokenExpired(token))
                {
                    // token is still valid - add auth to headers
                    request = this.addAuthHeader(request, token);
                }
                else if (jwtHelper.isTokenExpired(token))
                {
                    this.storage.get('stayLoggedin').then(isTrue => {
                        if (isTrue)
                        {
                            this.storage.get('refreshToken').then(token => {
                                if (!jwtHelper.isTokenExpired(token))
                                {
                                    const newToken = this.auth.refresh();
                                    request = this.addAuthHeader(request, newToken);
                                }
                            });   
                        }
                        else
                        {
                            this.router.navigateByUrl('/login');
                            return EMPTY;
                        }
                    });
                }
                else
                {
                    this.router.navigateByUrl('/login');
                    return EMPTY;
                }
            }

            // return (manipulated) request
            return next.handle(request);
        }));
    }

    addAuthHeader(request: HttpRequest<any>, token: string)
    {
        request = request.clone({
            headers: request.headers.set(
                'Authorization', 'Bearer ' + token
            )
        });

        return request;
    }
}