import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { TokenService } from "./services/token.service";
import { Subscriber } from "rxjs/Subscriber";
import { TokenGet, Token } from "./models/token";
import { Prefs } from "./models/prefs";
import { environment } from "../environments/environment";
import { Injector } from "@angular/core";
import { HttpInterceptor, HttpHandler, HttpEvent, HttpHeaders, HttpRequest, HttpResponse, HttpErrorResponse } from "@angular/common/http";

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // return a new observable
    return Observable.create((subscriber: Subscriber<HttpEvent<any>>) => {
      // only add token if logged in
      if (this.tokenService.hasToken()) {
        let token = this.tokenService.getStorageToken();

        // get the token (this will refresh if needed)
        // this.refreshToken(next).subscribe(token => {
        // if the header has already been set don't override it
        let headers: HttpHeaders = new HttpHeaders();
        if (!request.headers.has('Authorization') && !request.headers.has('authorization'))
          headers = headers.append('Authorization', 'Bearer ' + token.accessToken);

        if (!request.headers.has('Content-Type') && !request.headers.has('content-type'))
          headers = headers.append('Content-Type', 'application/json');

        // set the auth header with the token
        request = request.clone({
          headers: headers
        });

        // create the event stream
        next.handle(request).subscribe(event => {
          // pass the event back to the caller of the interceptor
          subscriber.next(event);
        })
        //});
      }
      else {
        // create the event stream
        next.handle(request).subscribe(event => {
          console.log(event);
          // pass the event back to the caller of the interceptor
          subscriber.next(event);
        })
      }
    })
  }

  /**
  * load the token from storage and refresh if needed
  */
  refreshToken(handler: HttpHandler): Observable<Token> {
    return Observable.create((subscriber: Subscriber<Token>) => {
      // create the post body
      let refresh_token = localStorage.getItem(Prefs.TOKEN_REFRESH_TOKEN);
      let body = "grant_type=refresh_token&refresh_token=" + refresh_token;

      // set the headers
      let headers: HttpHeaders = new HttpHeaders();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');

      // create the post options
      let options = { headers: headers };

      // create a new request
      let request: HttpRequest<any> = new HttpRequest<any>('POST', environment.base_endpoint + '/api/account/token', body, options);

      // pass the request through the handler
      handler.handle(request).subscribe(event => {
        // if the event is the response
        if (event instanceof HttpResponse) {
          // save the token
          this.tokenService.saveToken(event.body);

          // return the new token from storage
          subscriber.next(this.tokenService.getStorageToken());
        }
        else if (event instanceof HttpErrorResponse) {
          // TODO logout user
        }
      })
    })
  }
}