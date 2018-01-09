import { Injectable } from '@angular/core';
import { Token, TokenGet } from '../models/token';
import { Prefs } from '../models/prefs';

@Injectable()
export class TokenService {

  constructor() { }

  getToken(): Token {
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

  /**
   * is there a token saved
   */
  hasToken() {
    // make sure all the tokens properties exist
    return localStorage.getItem(Prefs.TOKEN_ACCESS_TOKEN) && localStorage.getItem(Prefs.TOKEN_REFRESH_TOKEN) && localStorage.getItem(Prefs.TOKEN_EMAIL) && localStorage.getItem(Prefs.TOKEN_USERID) && localStorage.getItem(Prefs.TOKEN_ROLES) && localStorage.getItem(Prefs.TOKEN_EXPIRES);
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
