import { Length } from 'class-validator';
import { GUID } from 'src/types';

export class CreateTaskDto {
  @Length(3, 50, { message: 'Title must be between 3 and 50 symbols' })
  title: string;

  date?: string;

  isImportant?: boolean;

  goalId?: GUID;
}
