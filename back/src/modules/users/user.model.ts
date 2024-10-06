import { index, prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface UserModel extends Base {}

@index({ login: 1, tgId: 1 }, { unique: true })
export class UserModel extends TimeStamps {
  @prop({ required: true, unique: true })
  tgId: string;

  @prop()
  login: string;

  @prop()
  userName: string; // tgFirstName + tgLastName
}
