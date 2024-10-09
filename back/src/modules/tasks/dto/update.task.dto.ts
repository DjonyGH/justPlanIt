import { IsString, IsBoolean } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  name?: string;
}

export class CompleteTaskDto {
  @IsBoolean()
  isDone: boolean;
}

export class ChangeOrderTaskDto {
  changeOrder: 1 | -1;
}
