import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { USER_NOT_FOUND } from 'src/errors/error.consts';
import { NewUserDto } from './dto/create.user.dto';
import { IUserResponse } from './types';
import { UserModel } from './user.model';
import { GUID } from 'src/types';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: ModelType<UserModel>,
  ) {}

  async getAllUsers(): Promise<UserModel[]> {
    console.log('service: getAllUsers');
    try {
      return await this.userModel.find();
    } catch (e: any) {
      console.error('ERROR: service seed');
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  async getUserByTgId(
    tgId: string,
    userName?: string,
    login?: string,
  ): Promise<UserModel | null> {
    console.log('service: getUserByTgId');
    try {
      const user = await this.userModel.findOne({ tgId });

      if (user) {
        return user;
      } else {
        const newUser = await this.userModel.create({
          tgId,
          login,
          userName,
        });

        if (newUser) {
          return newUser;
        }
      }
    } catch (e: any) {
      console.error('ERROR: service getUserByTgId', e);
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  async getUserById(id: GUID): Promise<IUserResponse | null> {
    console.log('service: get user by id');
    try {
      return {} as IUserResponse;
    } catch (e: any) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  async createUser(user: NewUserDto) {}

  async updateUser() {}

  async deleteUser() {}

  async findUserByLogin(
    login: string,
  ): Promise<DocumentType<UserModel> | null> {
    return this.userModel.findOne({ login });
  }

  async setPassword() {}
}
