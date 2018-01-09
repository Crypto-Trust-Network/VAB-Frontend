/**
 * Token model returned from api
 */
export class TokenGet {
  access_token: string;
  refresh_token: string;
  // in seconds
  expires_in: number;
  userId: string;
  email: string;
  // comma seperated list
  roles: string;
}

/**
 * Token model for local site use (when pulling from localStorage)
 */
export class Token {
  accessToken: string;
  expires: Date;
  userId: string;
  email: string;
  refreshToken: string;
  roles: Array<string> = [];
}