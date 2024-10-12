import { index, prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { GUID } from 'src/types';

export interface GoalModel extends Base {}

@index({ userId: 1 })
export class GoalModel extends TimeStamps {
  @prop({ required: true })
  title: string;

  @prop({ required: true })
  isDone: boolean;

  @prop({ required: true })
  date: string;

  @prop({ required: true })
  userId: GUID;
}
