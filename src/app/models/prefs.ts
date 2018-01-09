/**
 * Paths to local storage
 */
export class Prefs {
  public static get TOKEN_ACCESS_TOKEN(): string { return "token_accessToken"; }
  public static get TOKEN_REFRESH_TOKEN(): string { return "token_refreshToken" }
  public static get TOKEN_EXPIRES(): string { return "token_expires"; }
  public static get TOKEN_USERID(): string { return "token_userId"; }
  public static get TOKEN_EMAIL(): string { return "token_email"; }
  public static get TOKEN_ROLES(): string { return "token_roles"; }
}