import { IsBoolean, IsString } from 'class-validator';

export class UpdateGoalDto {
  @IsString()
  name: string;

  date: string;
}

export class CompleteGoalDto {
  @IsBoolean()
  isDone: boolean;
}
