import { index, prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { GUID } from 'src/types';

export interface TaskModel extends Base {}

@index({ userId: 1 })
export class TaskModel extends TimeStamps {
  @prop({ required: true })
  title: string;

  @prop({ required: true })
  isDone: boolean;

  @prop()
  date?: string;

  @prop({ required: true })
  order: number;

  @prop({ required: true })
  userId: GUID;

  @prop()
  isImportant?: boolean;

  @prop()
  goalId?: GUID;
}
