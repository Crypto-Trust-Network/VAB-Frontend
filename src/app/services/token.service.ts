import { Injectable } from '@angular/core';
import { Token, TokenGet } from '../models/token';
import { Prefs } from '../models/prefs';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { environment } from '../../environments/environment.prod';

@Injectable()
export class TokenService {

  constructor() { }

  /**
   * load the token straight from storage
   */
  getStorageToken(): Token {
    // check the token exists
    if (!this.hasToken())
      return null;

    let token: Token = new Token();

    // load the token values from localStorage
    token.accessToken = localStorage.getItem(Prefs.TOKEN_ACCESS_TOKEN);
    token.refreshToken = localStorage.getItem(Prefs.TOKEN_REFRESH_TOKEN);
    token.email = localStorage.getItem(Prefs.TOKEN_EMAIL);
    token.userId = localStorage.getItem(Prefs.TOKEN_USERID);

    // split roles to create an array
    token.roles = localStorage.getItem(Prefs.TOKEN_ROLES).split(',');

    // construct a new date object from the saved string
    token.expires = new Date(localStorage.getItem(Prefs.TOKEN_EXPIRES));

    return token;
  }

  tokenExpired(): boolean {
    // if now is after when the token expires
    return new Date().getTime() > this.getStorageToken().expires.getTime();
  }

  /**
   * is there a token saved
   */
  hasToken(): boolean {
    // make sure all the tokens properties exist
    return localStorage.getItem(Prefs.TOKEN_ACCESS_TOKEN) != null && localStorage.getItem(Prefs.TOKEN_REFRESH_TOKEN) != null && localStorage.getItem(Prefs.TOKEN_EMAIL) != null && localStorage.getItem(Prefs.TOKEN_USERID) != null && localStorage.getItem(Prefs.TOKEN_ROLES) != null && localStorage.getItem(Prefs.TOKEN_EXPIRES) != null;
  }

  /**
   * delete the token from local storage
   */
  deleteToken() {
    localStorage.removeItem(Prefs.TOKEN_ACCESS_TOKEN);
    localStorage.removeItem(Prefs.TOKEN_REFRESH_TOKEN);
    localStorage.removeItem(Prefs.TOKEN_EMAIL);
    localStorage.removeItem(Prefs.TOKEN_USERID);
    localStorage.removeItem(Prefs.TOKEN_ROLES);
    localStorage.removeItem(Prefs.TOKEN_EXPIRES);
  }

  /**
   * save the token into local storage
   * @param token the token from the api
   */
  saveToken(token: TokenGet) {
    localStorage.setItem(Prefs.TOKEN_ACCESS_TOKEN, token.access_token);
    localStorage.setItem(Prefs.TOKEN_REFRESH_TOKEN, token.refresh_token);
    localStorage.setItem(Prefs.TOKEN_EMAIL, token.email);
    localStorage.setItem(Prefs.TOKEN_USERID, token.userId);
    localStorage.setItem(Prefs.TOKEN_ROLES, token.roles);

    // create a new date
    let expiry: Date = new Date();

    // expiry is now + token lifetime * 1000 as managed in milliseconds
    expiry.setTime(expiry.getTime() + (token.expires_in * 1000))

    // save the date as a string
    localStorage.setItem(Prefs.TOKEN_EXPIRES, expiry.toString());
  }
}
