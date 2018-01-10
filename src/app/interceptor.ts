import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { TokenService } from "./services/token.service";
import { Subscriber } from "rxjs/Subscriber";
import { TokenGet, Token } from "./models/token";
import { Prefs } from "./models/prefs";
import { environment } from "../environments/environment";
import { Injector } from "@angular/core";
import { HttpInterceptor, HttpHandler, HttpEvent, HttpHeaders, HttpRequest, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { noAuth } from "./noAuth";
import { HttpClient } from "@angular/common/http/src/client";
import { Subscribable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { Subscription } from "rxjs/Subscription";

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // create new headers
    let headers: HttpHeaders = new HttpHeaders();

    // if no content-type has been set default to json
    if (!request.headers.has('Content-Type') && !request.headers.has('content-type'))
      headers = headers.append('Content-Type', 'application/json');

    // return a new observable
    return Observable.create((subscriber: Subscriber<HttpEvent<any>>) => {
      // is auth required for this route
      if (!noAuth.find(p => request.url.includes(p))) {
        // add auth
        if (!this.tokenService.hasToken())
          throw "User not logged in"

        // do we need to refresh the token
        if (this.tokenService.tokenExpired()) {
          // refresh the token and save the subscription
          let refreshSubscription: Subscription = this.refreshToken(next).subscribe(success => {
            // unsubscribe from the refresh obserable so we don't get the result next time the token is refreshed
            refreshSubscription.unsubscribe();

            // add the auth header with the new token
            if (!request.headers.has('Authorization') && !request.headers.has('authorization'))
              headers = headers.append('Authorization', 'Bearer ' + this.tokenService.getStorageToken().accessToken);

            // run request with auth
            this.runRequest(request, headers, next, subscriber);
          })
        }
        else {
          // add the auth header
          if (!request.headers.has('Authorization') && !request.headers.has('authorization'))
            headers = headers.append('Authorization', 'Bearer ' + this.tokenService.getStorageToken().accessToken);

          // run request with auth
          this.runRequest(request, headers, next, subscriber);
        }
      }
      else {
        // run request with no auth
        this.runRequest(request, headers, next, subscriber);
      }
    });
  }

  /**
   * run the request through the handler with the specified headers
   * @param request 
   * @param headers 
   * @param handler 
   * @param subscriber 
   */
  runRequest(request: HttpRequest<any>, headers: HttpHeaders, handler: HttpHandler, subscriber: Subscriber<HttpEvent<any>>) {
    // set the request headers
    request = request.clone({
      headers: headers
    });

    // create the event stream
    handler.handle(request).subscribe(
      success => {
        // pass the event back to the caller of the interceptor
        subscriber.next(success);
      },
      error => {
        // pass the event back to the caller of the interceptor
        subscriber.error(error);
      }
    )
  }

  // refresh obserable so refresh can be called multiple times in a few seconds but get the same result without running more than 1 refesh request
  refreshObservable: Subject<Token> = new Subject<Token>();

  // are we running a refresh token request
  refreshing: boolean = false;

  /**
  * load the token from storage and refresh if needed
  */
  refreshToken(handler: HttpHandler): Observable<Token> {
    // don't run request if we're already refreshing the token
    if (!this.refreshing) {
      // request started
      this.refreshing = true;

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
          this.refreshObservable.next(this.tokenService.getStorageToken());

          // request finished
          this.refreshing = false;
        }
        else if (event instanceof HttpErrorResponse) {
          // request finished
          this.refreshing = false;

          // TODO logout user as they're now in a 'locked out but logged in' state
        }
      })
    }

    // return the refresh token obserable
    return this.refreshObservable;
  }
}