import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MyJwtModule } from 'src/jwt/myJwt.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  imports: [MyJwtModule, ConfigModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
