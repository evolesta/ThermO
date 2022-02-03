// JWT interceptor
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { EMPTY, from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators'
import { StorageService } from '../storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

@Injectable()
export class httpInterceptor implements HttpInterceptor {
    private APIURL = environment.apiUrl;

    // routes which doesn't require a auth header, for ex. auth routes
    private disallowedRoutes = [
        this.APIURL + '/api/token/',
        this.APIURL + '/api/token/refresh/'
    ];

    constructor(private storage: StorageService,) 
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
                else
                {
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