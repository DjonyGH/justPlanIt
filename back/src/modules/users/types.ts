import { UserModel } from './user.model';

export interface IUserResponse extends Omit<UserModel, 'password'> {}
