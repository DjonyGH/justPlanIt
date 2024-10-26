import { IsBoolean, Length } from 'class-validator';

export class UpdateGoalDto {
  @Length(1, 100, { message: 'Title must be between 1 and 100 symbols' })
  title: string;

  date: string;
}

export class CompleteGoalDto {
  @IsBoolean()
  isDone: boolean;
}
