import { Body, Controller, Post } from '@nestjs/common';
import { loginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authSevice: AuthService) {}

  // Проверяет телеграм данные юзера и возвращает юзера и токен
  @Post()
  async login(@Body() loginDto: loginDto) {
    console.log('controller: login');

    const res = await this.authSevice.login(
      loginDto.checkData,
      loginDto.userData,
    );

    return res;
  }
}
