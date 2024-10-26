import { Length } from 'class-validator';
import { GUID } from 'src/types';

export class CreateTaskDto {
  @Length(1, 100, { message: 'Title must be between 1 and 100 symbols' })
  title: string;

  date?: string;

  isImportant?: boolean;

  goalId?: GUID;
}
