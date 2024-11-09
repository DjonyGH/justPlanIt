import { Body, Controller, Post } from '@nestjs/common';
import { CheckDataDto } from './dto/checkData.dto';
import { UserDto } from './dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authSevice: AuthService) {}

  // Проверяет телеграм данные юзера и возвращает юзера и токен
  @Post()
  async login(@Body() checkDataDto: CheckDataDto, userDto: UserDto) {
    console.log('controller: login');

    const res = await this.authSevice.login(checkDataDto, userDto);
    return res;
  }
}
