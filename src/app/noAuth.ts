// list of api routes that don't need an authorization header
export const noAuth: Array<string> = [
  // Note you can do '/api/account' to remove auth from a whole route section
  '/api/account/token',
  '/api/account/login',
  '/api/account/register'
]