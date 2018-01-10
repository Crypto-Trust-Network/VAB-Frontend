import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TokenService } from './services/token.service';
import { RegisterPost } from './models/account';
import { Observable } from 'rxjs/Observable';
import { environment } from '../environments/environment';
import { TokenGet } from './models/token';
import { Subscriber } from 'rxjs/Subscriber';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AppService {

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  // a behaviour subject so you we can have an initial value
  public loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.tokenService.hasToken());

  /**
   * change the logged in state
   * @param loggedIn 
   */
  setIsLoggedIn(loggedIn: boolean) {
    // emit to any listeners
    this.loggedIn.next(loggedIn);
  }

  /**
   * register the user then login
   * @param model 
   */
  register(model: RegisterPost): Observable<any> {
    return Observable.create((subscriber: Subscriber<any>) => {
      // the register api call
      let httpResponse: Observable<any> = this.http.post(environment.base_endpoint + '/api/account/register', model, { responseType: 'text' });

      // this subscription is called before the component one so we can save the token first
      httpResponse.subscribe(
        token => {
          this.login(model.Email, model.Password).subscribe(
            success => {
              // token is saved and login success has been emited, emit the register observable
              subscriber.next();
            },
            error => {
              // error logging in, user is already registered
              subscriber.error(error);
            });
        },
        error => {
          // register error
          subscriber.error(error);
        })
    });
  }

  /**
   * get a token, which is saved here so this can be used in multiple places without having to manage the token each time
   * @param email 
   * @param password 
   */
  login(email: string, password: string): Observable<any> {
    var body = "userName=" + email + "&password=" + password + '&grant_type=password';

    let httpResponse: Observable<TokenGet> = this.http.post<TokenGet>(environment.base_endpoint + '/api/account/token', body);

    // this subscription is called before the component one so we can save the token first
    httpResponse.subscribe(
      token => {
        // save the token
        this.tokenService.saveToken(token);

        // emit the loggedIn event
        this.setIsLoggedIn(true);
      },
      error => {
        // don't do anything for error, the user will be alerted by the component calling this function
      })

    return httpResponse;
  }
}
