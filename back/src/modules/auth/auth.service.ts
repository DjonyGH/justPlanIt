import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserModel } from '../users/user.model';
import { CheckData, UserData } from './dto/login.dto';
import { UserService } from '../users/user.service';
import { HmacSHA256 } from 'crypto-js';
import { JwtService } from '@nestjs/jwt';
import { LOGIN_OR_PASSWORD_ERROR } from 'src/errors/error.consts';

const token = '7049203455:AAGv_Kj2-E2nAsAq_tR9b4Ipt5ru-1h4_9c';

@Injectable()
export class AuthService {
  constructor(
    private readonly userSevice: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    checkDataDto: CheckData,
    userDto: UserData,
  ): Promise<{ accessToken: string; user: UserModel }> {
    console.log('Service: login');

    const secretKey = HmacSHA256(token, 'WebAppData');
    const check = HmacSHA256(checkDataDto.checkData, secretKey).toString();

    if (check !== checkDataDto.hash)
      throw new HttpException(LOGIN_OR_PASSWORD_ERROR, HttpStatus.NOT_FOUND);

    const user = await this.userSevice.getUserByTgId(
      userDto.tgId,
      userDto.userName,
      userDto.login,
    );

    const userPayload = {
      tgId: user.tgId,
      userId: user._id,
      login: user.login,
      userName: user.userName,
    };

    const accessToken = await this.jwtService.signAsync(userPayload);

    return { accessToken, user };
  }
}
