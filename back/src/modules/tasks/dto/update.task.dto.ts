import { IsString, IsBoolean, Length } from 'class-validator';

export class UpdateTaskDto {
  @Length(1, 100, { message: 'Title must be between 1 and 100 symbols' })
  title: string;

  date?: string;

  isImportant?: boolean;
}

export class CompleteTaskDto {
  @IsBoolean()
  isDone: boolean;
}

export class ChangeOrderTaskDto {
  changeOrder: 1 | -1;
}

export class CurrentDateDto {
  currentDate: string;
}
