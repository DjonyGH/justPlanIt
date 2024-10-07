import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import { user } from './middleware/user.middleware';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  // app.enableCors({
  //   origin: [
  //     'http://185.96.163.68',
  //     'http://localhost:3000',
  //     'http://localhost:80',
  //     'http://127.0.0.1:4040',
  //     'http://192.168.0.147:3000',
  //     'http://192.168.0.105:3000',
  //     'http://3c64-176-196-20-174.ngrok-free.app',
  //     'https://3c64-176-196-20-174.ngrok-free.app',
  //     'https://7383-176-196-20-174.ngrok-free.app',
  //   ],
  // });

  app.setGlobalPrefix('api');
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(user);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3001);
}
bootstrap();
