import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

declare module 'express-session' {
  interface Session {
    userId: string;
    ownerId: string;
  }
}

const configService = new ConfigService();
const jwtService = new JwtService({
  secret: configService.get('JWT_SECRET_KEY'),
});

export function user(req: Request, _: Response, next: NextFunction) {
  console.log('user middleware');
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      const user = jwtService.verify(token);
      req.session.userId = user.id;
      req.session.ownerId = user.ownerId;
    } catch (error) {}
  }
  next();
}
