import { Injectable } from '@nestjs/common';
import { UserModel } from '../users/user.model';
import { CheckDataDto } from './dto/checkData.dto';
import { UserDto } from './dto/user.dto';
import { UserService } from '../users/user.service';
import { HmacSHA256 } from 'crypto-js';
import { JwtService } from '@nestjs/jwt';

const token = '7049203455:AAGv_Kj2-E2nAsAq_tR9b4Ipt5ru-1h4_9c';

@Injectable()
export class AuthService {
  constructor(
    private readonly userSevice: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    checkDataDto: CheckDataDto,
    userDto: UserDto,
  ): Promise<{ user: UserModel; accessToken: string }> {
    console.log('Service: login');
    const { accessToken } = await this.checkTgDataAndCreateToken(
      checkDataDto,
      userDto,
    );

    if (!accessToken) return;

    const user = await this.userSevice.getUserByTgId(
      userDto.tgId,
      userDto.userName,
      userDto.login,
    );
    return { user, accessToken };
  }

  async checkTgDataAndCreateToken(
    checkDataDto: CheckDataDto,
    userDto: UserDto,
  ): Promise<{ accessToken: string }> {
    console.log('Service: checkTgDataAndCreateToken');

    const secretKey = HmacSHA256(token, 'WebAppData');
    const check = HmacSHA256(checkDataDto.checkData, secretKey).toString();

    if (check !== checkDataDto.hash) return;

    const accessToken = await this.jwtService.signAsync(userDto);

    return { accessToken };
  }
}
