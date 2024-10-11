import { IsString, IsBoolean } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  name?: string;

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
