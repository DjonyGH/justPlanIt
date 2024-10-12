import { IsString } from 'class-validator';

export class UpdateGoalDto {
  @IsString()
  name: string;

  date: string;
}
