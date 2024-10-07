import { Request, Response, NextFunction } from 'express';

declare module 'express-session' {
  interface Session {
    userId: string;
  }
}

const getCookieValue = (name, cookies) => {
  var found = cookies.split(';').filter((c) => c.trim().split('=')[0] === name);
  return found.length > 0 ? found[0].split('=')[1] : null;
};

export function user(req: Request, _: Response, next: NextFunction) {
  const userId = getCookieValue('userId', req.headers.cookie);
  console.log('user middleware', userId);
  req.session.userId = userId;
  next();
}
