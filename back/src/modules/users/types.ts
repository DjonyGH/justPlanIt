import { UserModel } from './user.model';

export interface IUserResponse extends Omit<UserModel, 'password'> {}

export interface IUserTokenPayload {
  tgId: string;
  login: string;
  userName: string;
}
