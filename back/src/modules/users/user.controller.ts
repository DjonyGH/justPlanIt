import {
  Body,
  Controller,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CreateUserDto, NewUserDto } from './dto/create.user.dto';
import { UserService } from './user.service';
import { JWTGuard } from 'src/jwt/jwt.guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';

@Controller('users')
export class UserController {
  constructor(private readonly userSevice: UserService) {}

  // Возвращает юзера или создает нового
  @Post()
  async getUserOrCreate(@Body() user: NewUserDto) {
    console.log('controller: getUserOrCreate');

    const res = await this.userSevice.getUserByTgId(
      user.tgId,
      user.userName,
      user.login,
    );
    return res;
  }

  @Post()
  async createUser(@Body() dto: { user: CreateUserDto; code: string }) {
    console.log('controller: createUser');
    return this.userSevice.createUser(dto.user);
  }

  @Put(':id')
  @UseGuards(JWTGuard)
  async updateUser() {}

  @Post('set-password')
  @UseGuards(JWTGuard)
  @UsePipes(ValidationPipe)
  async setPassword() {}
}
